// Fixtures deterministas que imitan el shape real de rickandmortyapi.com/api/character.
// Contrato confirmado leyendo backend/src/types/character.types.ts y
// backend/src/services/rickAndMorty.service.ts (paths reales: /character?page=&name=, /character/:id).
//
// .mjs plano en vez de .ts — el webServer.command de Playwright corre
// como proceso de shell aparte (no pasa por el transform de esbuild de Playwright),
// y e2e/package.json no tiene "type": "module", así que .ts requeriría el flag
// experimental --experimental-strip-types de Node. JS puro evita eso sin dependencias.

function makeCharacter(id, name) {
  return {
    id,
    name,
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Male",
    origin: { name: "Earth (C-137)", url: "https://rickandmortyapi.com/api/location/1" },
    location: { name: "Citadel of Ricks", url: "https://rickandmortyapi.com/api/location/3" },
    image: `https://rickandmortyapi.com/api/character/avatar/${id}.jpeg`,
    episode: ["https://rickandmortyapi.com/api/episode/1"],
    url: `https://rickandmortyapi.com/api/character/${id}`,
    created: "2017-11-04T18:48:46.250Z",
  };
}

// PAGE_SIZE=2 (el real es 20) alcanza para ejercitar paginación con pocos fixtures.
export const PAGE_SIZE = 2;

export const ALL_CHARACTERS = [
  makeCharacter(1, "Rick Sanchez"),
  makeCharacter(2, "Rick Prime"),
  makeCharacter(3, "Rick D716"),
  makeCharacter(4, "Morty Smith"),
];

function paginate(list, page) {
  const start = (page - 1) * PAGE_SIZE;
  const results = list.slice(start, start + PAGE_SIZE);
  const pages = Math.ceil(list.length / PAGE_SIZE);
  return {
    info: {
      count: list.length,
      pages,
      next: page < pages ? `http://mock/character?page=${page + 1}` : null,
      prev: page > 1 ? `http://mock/character?page=${page - 1}` : null,
    },
    results,
  };
}

export function listResponseFor(name, page) {
  const filtered =
    name === ""
      ? ALL_CHARACTERS
      : ALL_CHARACTERS.filter((c) => c.name.toLowerCase().includes(name.toLowerCase()));

  if (filtered.length === 0) {
    // Contrato real confirmado: rickandmortyapi.com devuelve 404 con este body
    // exacto cuando la búsqueda no matchea nada (y el backend lo traduce a 200 []).
    return { status: 404, body: { error: "There is nothing here" } };
  }

  const result = paginate(filtered, page);
  if (result.results.length === 0) {
    return { status: 404, body: { error: "There is nothing here" } };
  }
  return { status: 200, body: result };
}

export function characterById(id) {
  const found = ALL_CHARACTERS.find((c) => c.id === id);
  if (!found) {
    return { status: 404, body: { error: "Character not found" } };
  }
  return { status: 200, body: found };
}
