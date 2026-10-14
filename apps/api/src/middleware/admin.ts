import type { RequestHandler } from "express";
import { env } from "../config/env.js";
export const requireAdmin: RequestHandler = (req, res, next) => { if (env.NODE_ENV === "development" || req.header("x-admin-key") === env.ADMIN_API_KEY) return next(); res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Admin key required" } }); };
