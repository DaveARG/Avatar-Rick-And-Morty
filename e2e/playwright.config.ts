import { defineConfig } from "@playwright/test";

// ponytail: smoke minimo, sin proyectos multi-browser. Solo chromium.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  // 1 reintento local / 2 en CI: absorbe flakiness transitoria de arranque de los
  // webServer (race de reuseExistingServer al correr la suite repetidas veces). Un
  // fallo real falla igual todos los reintentos; esto no oculta bugs.
  retries: process.env.CI ? 2 : 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: [
    {
      // ponytail: mock nativo (node:http, sin deps nuevas) del upstream real.
      // rickandmortyapi.com está detrás de Cloudflare con rate-limiting; bajo
      // carga a veces responde HTML de challenge y el backend lo traduce a un
      // 500 genérico, rompiendo el test de "sin resultados" de forma intermitente.
      // Ver e2e/mock/upstream-server.mjs para el detalle completo.
      command: "node mock/upstream-server.mjs",
      port: 3002,
      timeout: 10_000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "pnpm --dir ../backend dev",
      port: 3001,
      timeout: 30_000,
      reuseExistingServer: !process.env.CI,
      env: {
        UPSTREAM_BASE_URL: "http://localhost:3002/api",
        CORS_ORIGIN: "http://localhost:5173",
      },
    },
    {
      command: "pnpm --dir ../frontend dev",
      port: 5173,
      timeout: 30_000,
      reuseExistingServer: !process.env.CI,
      env: {
        VITE_API_URL: "http://localhost:3001",
      },
    },
  ],
});
