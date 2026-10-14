import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { sql } from "./client.js";

const migrationsDirectory = fileURLToPath(new URL("./migrations", import.meta.url));

try {
  await sql`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  const files = (await readdir(migrationsDirectory))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const [applied] = await sql<{ name: string }[]>`
      SELECT name FROM schema_migrations WHERE name = ${file}
    `;

    if (applied) {
      console.log(`Skipping ${file} (already applied)`);
      continue;
    }

    const migration = await readFile(`${migrationsDirectory}/${file}`, "utf8");
    await sql.begin(async (transaction) => {
      await transaction.unsafe(migration);
      await transaction`
        INSERT INTO schema_migrations (name) VALUES (${file})
      `;
    });

    console.log(`Applied ${file}`);
  }

  console.log("Database migrations complete");
} catch (error) {
  const connectionError = error as { code?: string; errors?: { code?: string }[] };
  const refused = connectionError.code === "ECONNREFUSED" ||
    connectionError.errors?.some((nested) => nested.code === "ECONNREFUSED");

  if (refused) {
    console.error(
      "Unable to connect to PostgreSQL. Start it with `docker compose up -d postgres` " +
      "or update DATABASE_URL in the repository-level .env file."
    );
  } else {
    console.error(error);
  }

  process.exitCode = 1;
} finally {
  await sql.end();
}
