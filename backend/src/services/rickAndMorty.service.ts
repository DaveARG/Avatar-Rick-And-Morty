const UPSTREAM_BASE_URL =
  process.env.UPSTREAM_BASE_URL;
const TIMEOUT_MS = 8000;

interface UpstreamResult {
  status: number;
  body: unknown;
}

async function upstreamFetch(path: string): Promise<UpstreamResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${UPSTREAM_BASE_URL}${path}`, {
      signal: controller.signal,
    });
    return { status: res.status, body: await res.json() };
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchCharacterList(
  name: string,
  page: number
): Promise<UpstreamResult> {
  const params = new URLSearchParams({ page: String(page) });
  if (name !== "") {
    params.set("name", name);
  }
  return upstreamFetch(`/character?${params.toString()}`);
}

export async function fetchCharacterById(id: number): Promise<UpstreamResult> {
  return upstreamFetch(`/character/${id}`);
}
