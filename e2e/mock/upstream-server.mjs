// Mock mínimo del upstream real (rickandmortyapi.com) para el e2e.
//
// El e2e original pegaba directo a rickandmortyapi.com. Ese servicio
// está detrás de Cloudflare con rate-limiting y bajo carga a veces devuelve HTML
// de challenge en vez de JSON -- el backend lo propaga como 500 genérico
// ("Upstream service unavailable"), rompiendo el test de "sin resultados"
// (ver backend/src/services/rickAndMorty.service.ts línea ~38, y
// backend/src/routes/characters.routes.test.ts "upstream devuelve HTML no-JSON").
// Un e2e no debe depender de la disponibilidad/rate-limit de un tercero: este
// servidor nativo (módulo http, sin dependencias nuevas) sirve fixtures fijas
// en las mismas rutas/shape que el backend real consume, así el e2e sigue
// siendo backend+frontend reales de punta a punta, solo el tercero está aislado.
import { createServer } from "node:http";
import { listResponseFor, characterById } from "./fixtures.mjs";

const PORT = Number(process.env.MOCK_UPSTREAM_PORT ?? 3002);

function send(res, status, body) {
  const json = JSON.stringify(body);
  res.writeHead(status, { "content-type": "application/json" });
  res.end(json);
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  const listMatch = url.pathname === "/api/character";
  const byIdMatch = url.pathname.match(/^\/api\/character\/(\d+)$/);

  if (listMatch) {
    const name = url.searchParams.get("name") ?? "";
    const page = Number(url.searchParams.get("page") ?? "1");
    const { status, body } = listResponseFor(name, page);
    send(res, status, body);
    return;
  }

  if (byIdMatch) {
    const { status, body } = characterById(Number(byIdMatch[1]));
    send(res, status, body);
    return;
  }

  send(res, 404, { error: "There is nothing here" });
});

server.listen(PORT, () => {
  console.log(`mock upstream listening on ${PORT}`);
});
