export function validatePage(raw: unknown): number | null {
  if (raw === undefined) return 1;
  if (typeof raw !== "string" || !/^\d+$/.test(raw)) return null; // rechaza "0x10", "1e3", " 5 ", etc.
  const n = Number(raw);
  if (!Number.isSafeInteger(n) || n < 1) return null;
  return n;
}

export function validateName(raw: unknown): string | null {
  if (raw === undefined) return ""; // ausente = sin filtro
  if (typeof raw !== "string") return ""; // defensivo, edge case de query parsing
  if (raw.length > 100) return null;
  return raw; // incluye "" vacío = sin filtro
}

export function validateId(raw: unknown): number | null {
  if (typeof raw !== "string" || !/^\d+$/.test(raw)) return null; // cubre "abc", "-1", "1.5", "", "0x10", "1e3"
  const n = Number(raw);
  if (!Number.isSafeInteger(n) || n <= 0) return null;
  return n;
}
