import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    // VITE_API_URL es obligatoria (ver characters.service.ts) y se valida al
    // importar el service; los tests que lo importan necesitan un valor válido.
    env: {
      VITE_API_URL: "http://localhost:3001",
    },
  },
});
