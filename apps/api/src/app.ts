import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { env } from "./config/env.js";
import { routes } from "./routes.js";
import { errorHandler, notFound } from "./middleware/errors.js";
export const createApp = () => {
  const app = express(); app.disable("x-powered-by"); app.use(helmet()); app.use(cors({ origin: env.FRONTEND_URL }));
  app.use(express.json({ limit: "32kb" })); app.use("/api/v1", rateLimit({ windowMs: 60_000, limit: env.NODE_ENV === "test" ? 10_000 : 120, standardHeaders: "draft-8" }), routes);
  app.use(notFound); app.use(errorHandler); return app;
};
