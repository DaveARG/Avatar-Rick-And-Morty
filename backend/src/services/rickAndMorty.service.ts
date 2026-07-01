import { UpstreamError } from "../middlewares/errorHandler.js";
import { TtlCache } from "./cache.js";

const UPSTREAM_BASE_URL = process.env.UPSTREAM_BASE_URL;
const TIMEOUT_MS = 8000;
const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_MAX_ENTRIES = 500;

interface UpstreamResult {
  status: number;
  body: unknown;
}

// ponytail: una sola cache compartida para list + byId, la key incluye el prefijo
// del path así que no hay colisión entre ambos endpoints.
const cache = new TtlCache<UpstreamResult>(CACHE_TTL_MS, CACHE_MAX_ENTRIES);

export function clearUpstreamCache(): void {
  cache.clear();
}

async function upstreamFetch(path: string): Promise<UpstreamResult> {
  const cached = cache.get(path);
  if (cached !== undefined) return cached;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${UPSTREAM_BASE_URL}${path}`, {
      signal: controller.signal,
    });
    let body: unknown;
    try {
      // ponytail: sin chequeo de content-type — res.json() ya rechaza cualquier
      // body no-JSON (HTML de Cloudflare incluido) con el mismo efecto práctico.
      body = await res.json();
    } catch (parseErr) {
      throw new UpstreamError(
        `upstream returned non-JSON body (status ${res.status}): ${(parseErr as Error).message}`,
      );
    }
    const result: UpstreamResult = { status: res.status, body };
    if (result.status === 200) {
      cache.set(path, result);
    }
    return result;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchCharacterList(name: string, page: number): Promise<UpstreamResult> {
  const params = new URLSearchParams({ page: String(page) });
  if (name !== "") {
    params.set("name", name);
  }
  return upstreamFetch(`/character?${params.toString()}`);
}

export async function fetchCharacterById(id: number): Promise<UpstreamResult> {
  return upstreamFetch(`/character/${id}`);
}
