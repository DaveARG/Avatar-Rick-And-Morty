import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { charactersRouter } from "./routes/characters.routes.js";

export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(cors({ origin: process.env.CORS_ORIGIN }));
  app.use(express.json());
  app.use("/characters", charactersRouter);
  app.use((_req, res) => res.status(404).json({ error: "Not found" })); // catch-all, antes del errorHandler
  app.use(errorHandler); // último middleware, 4 args
  return app;
}
