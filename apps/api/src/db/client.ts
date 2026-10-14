import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "../config/env.js";
import * as schema from "./schema.js";
export const sql = postgres(env.DATABASE_URL, {
  max: 10,
  ssl: env.DB_SSL === "require" ? "require" : false
});
export const db = drizzle(sql, { schema });
