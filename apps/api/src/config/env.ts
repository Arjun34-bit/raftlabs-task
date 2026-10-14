import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { z } from "zod";

// npm workspace scripts run with apps/api as their working directory. Resolve
// the repository-level .env from this file so commands behave consistently.
config({ path: fileURLToPath(new URL("../../../../.env", import.meta.url)) });
export const env = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url().optional(),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().int().positive().default(5433),
  DB_USER: z.string().default("postgres"),
  DB_PASSWORD: z.string().default("postgres"),
  DB_NAME: z.string().default("raftlabs_orders"),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  DEMO_MODE: z.string().default("true").transform(v => v === "true"),
  ADMIN_API_KEY: z.string().default("change-me")
}).transform((values) => ({
  ...values,
  DATABASE_URL: values.DATABASE_URL ??
    `postgresql://${encodeURIComponent(values.DB_USER)}:${encodeURIComponent(values.DB_PASSWORD)}` +
    `@${values.DB_HOST}:${values.DB_PORT}/${values.DB_NAME}`
})).parse(process.env);
