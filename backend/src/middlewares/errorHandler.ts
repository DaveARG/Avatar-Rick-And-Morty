import type { NextFunction, Request, Response } from "express";

export class ValidationError extends Error {}
export class NotFoundError extends Error {}
export class UpstreamError extends Error {}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error(err);

  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
    return;
  }
  if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
    return;
  }
  // UpstreamError, timeouts, fallos de red, JSON inválido del upstream, etc.
  // Nunca se filtra err.message/err.stack del upstream al cliente.
  res.status(500).json({ error: "Upstream service unavailable" });
}
