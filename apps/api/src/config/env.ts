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
  // Hosted PostgreSQL providers generally require TLS. Keep local development
  // convenient, while allowing either environment to override the default.
  DB_SSL: z.enum(["disable", "require"]).optional(),
  FRONTEND_URL: z.string().url().default("http://localhost:3000")
    .transform((value) => value.replace(/\/+$/, "")),
  DEMO_MODE: z.string().default("true").transform(v => v === "true"),
  ORDER_PREPARING_DELAY_MS: z.coerce.number().int().positive().default(10_000),
  ORDER_DELIVERY_START_DELAY_MS: z.coerce.number().int().positive().default(25_000),
  ORDER_DELIVERED_DELAY_MS: z.coerce.number().int().positive().default(45_000),
  ORDER_WORKER_INTERVAL_MS: z.coerce.number().int().positive().default(2_000),
  ADMIN_API_KEY: z.string().default("change-me")
}).transform((values) => {
  const DB_SSL = values.DB_SSL ??
    (values.NODE_ENV === "production" ? "require" : "disable");

  return {
    ...values,
    DB_SSL,
    DATABASE_URL: values.DATABASE_URL ??
      `postgresql://${encodeURIComponent(values.DB_USER)}:${encodeURIComponent(values.DB_PASSWORD)}` +
      `@${values.DB_HOST}:${values.DB_PORT}/${values.DB_NAME}?sslmode=${DB_SSL}`
  };
}).parse(process.env);
