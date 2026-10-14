import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
export const notFound: RequestHandler = (_req, res) => { res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Route not found" } }); };
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Invalid request", details: error.issues.map(i => ({ field: i.path.join("."), message: i.message })) } });
  const status = Number(error.status) || 500; res.status(status).json({ success: false, error: { code: error.code || "INTERNAL_ERROR", message: status === 500 ? "An unexpected error occurred" : error.message } });
};
