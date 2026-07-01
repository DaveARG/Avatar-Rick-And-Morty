interface Config {
  upstreamBaseUrl: string;
  corsOrigin: string;
  port: number;
  rateLimitMax: number;
  rateLimitWindowMs: number;
}

function requireUrl(name: string, missing: string[]): string {
  const raw = process.env[name]?.trim();
  if (raw === undefined || raw === "") {
    missing.push(name);
    return "";
  }
  try {
    new URL(raw);
  } catch {
    throw new Error(`Environment variable ${name} must be a valid URL, got: ${raw}`);
  }
  return raw;
}

function parseNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Environment variable ${name} must be a valid number, got: ${raw}`);
  }
  return parsed;
}

export function loadConfig(): Config {
  const missing: string[] = [];
  const upstreamBaseUrl = requireUrl("UPSTREAM_BASE_URL", missing);
  const corsOrigin = requireUrl("CORS_ORIGIN", missing);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. Copy .env.example to .env and set them.`,
    );
  }

  return {
    upstreamBaseUrl,
    corsOrigin,
    port: parseNumber("PORT", 3001),
    rateLimitMax: parseNumber("RATE_LIMIT_MAX", 100),
    rateLimitWindowMs: parseNumber("RATE_LIMIT_WINDOW_MS", 60_000),
  };
}

// Singleton: se computa una sola vez al primer import. Si UPSTREAM_BASE_URL o
// CORS_ORIGIN faltan/son inválidas, loadConfig() lanza — y como este import
// ocurre antes que cualquier otro código en la cadena de imports de server.ts,
// ese throw ES el fail-fast (Node imprime el mensaje del Error y termina con
// código de salida distinto de 0). server.ts no necesita un try/catch propio:
// un throw no capturado durante la carga de módulos ya aborta el arranque.
export const config = loadConfig();
