import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // UPSTREAM_BASE_URL y CORS_ORIGIN son obligatorias (ver src/config.ts) y se
    // validan al importar la app; los tests necesitan valores válidos para que
    // createApp() no falle al cargar el módulo.
    env: {
      UPSTREAM_BASE_URL: "http://localhost:3002/api",
      CORS_ORIGIN: "http://localhost:5173",
    },
  },
});
