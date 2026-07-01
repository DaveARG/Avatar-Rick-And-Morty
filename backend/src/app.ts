import cors from "cors";
import express from "express";
import { rateLimit } from "express-rate-limit";
import { errorHandler } from "./middlewares/errorHandler.js";
import { charactersRouter } from "./routes/characters.routes.js";

export function createApp() {
  const app = express();
  // Oculta el header "X-Powered-By: Express" que Express agrega por defecto.
  // Ese header revela el framework al cliente, facilitando fingerprinting/reconocimiento
  // a un atacante que busca vulnerabilidades conocidas de Express.
  app.disable("x-powered-by");
  app.use(cors({ origin: process.env.CORS_ORIGIN }));
  app.use(express.json());
  app.use(
    rateLimit({
      windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000),
      max: Number(process.env.RATE_LIMIT_MAX ?? 100),
      standardHeaders: true,
      legacyHeaders: false,
      handler: (_req, res) => {
        res.status(429).json({ error: "Too many requests" });
      },
    }),
  );
  app.use("/characters", charactersRouter);
  app.use((_req, res) => res.status(404).json({ error: "Not found" })); // catch-all, antes del errorHandler
  app.use(errorHandler); // último middleware, 4 args
  return app;
}
