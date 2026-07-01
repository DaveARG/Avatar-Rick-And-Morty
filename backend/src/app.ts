import cors from "cors";
import express from "express";
import { rateLimit } from "express-rate-limit";
import { loadConfig } from "./config.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { charactersRouter } from "./routes/characters.routes.js";

export function createApp() {
  // loadConfig() (no el singleton config) para que tests que mutan process.env
  // entre llamadas a createApp() (ej. rate-limit) vean el valor actualizado.
  const config = loadConfig();
  const app = express();
  // Oculta el header "X-Powered-By: Express" que Express agrega por defecto.
  // Ese header revela el framework al cliente, facilitando fingerprinting/reconocimiento
  // a un atacante que busca vulnerabilidades conocidas de Express.
  app.disable("x-powered-by");
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json());
  app.use(
    rateLimit({
      windowMs: config.rateLimitWindowMs,
      max: config.rateLimitMax,
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
