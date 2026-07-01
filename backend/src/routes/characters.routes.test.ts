import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../app.js";
import type { Character, CharacterListResponse } from "../types/character.types.js";

const mockCharacter: Character = {
  id: 1,
  name: "Rick Sanchez",
  status: "Alive",
  species: "Human",
  type: "",
  gender: "Male",
  origin: { name: "Earth (C-137)", url: "https://rickandmortyapi.com/api/location/1" },
  location: { name: "Citadel of Ricks", url: "https://rickandmortyapi.com/api/location/3" },
  image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
  episode: ["https://rickandmortyapi.com/api/episode/1"],
  url: "https://rickandmortyapi.com/api/character/1",
  created: "2017-11-04T18:48:46.250Z",
};

const mockListResponse: CharacterListResponse = {
  info: { count: 1, pages: 1, next: null, prev: null },
  results: [mockCharacter],
};

function mockUpstream(status: number, body: unknown) {
  vi.spyOn(global, "fetch").mockResolvedValueOnce(
    new Response(JSON.stringify(body), { status })
  );
}

function mockUpstreamFailure() {
  vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("network down"));
}

let app: express.Express;

beforeEach(() => {
  app = createApp();
  vi.restoreAllMocks();
});

describe("GET /characters", () => {
  it("devuelve 200 con resultados cuando hay coincidencias", async () => {
    mockUpstream(200, mockListResponse);

    const res = await request(app).get("/characters?name=rick&page=1");

    expect(res.status).toBe(200);
    expect(res.body.results).toHaveLength(1);
    expect(res.body.info.count).toBe(1);
  });

  it("name sin match (404 upstream) devuelve 200 con results: []", async () => {
    mockUpstream(404, { error: "There is nothing here" });

    const res = await request(app).get("/characters?name=zzzznoexiste123");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      info: { count: 0, pages: 0, next: null, prev: null },
      results: [],
    });
  });

  it("page fuera de rango (404 upstream) devuelve 200 con results: []", async () => {
    mockUpstream(404, { error: "There is nothing here" });

    const res = await request(app).get("/characters?page=9999");

    expect(res.status).toBe(200);
    expect(res.body.results).toEqual([]);
  });

  it("page no numérico devuelve 400", async () => {
    const res = await request(app).get("/characters?page=abc");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "page must be a positive integer" });
  });

  it("page 0 devuelve 400", async () => {
    const res = await request(app).get("/characters?page=0");

    expect(res.status).toBe(400);
  });

  it("page en formato hexadecimal (0x10) devuelve 400", async () => {
    const res = await request(app).get("/characters?page=0x10");

    expect(res.status).toBe(400);
  });

  it("page en notación científica (1e3) devuelve 400", async () => {
    const res = await request(app).get("/characters?page=1e3");

    expect(res.status).toBe(400);
  });

  it("name vacío devuelve 200 con listado sin filtro", async () => {
    mockUpstream(200, mockListResponse);

    const res = await request(app).get("/characters?name=");

    expect(res.status).toBe(200);
    expect(res.body.results).toHaveLength(1);
  });

  it("name ausente devuelve 200 con listado sin filtro", async () => {
    mockUpstream(200, mockListResponse);

    const res = await request(app).get("/characters");

    expect(res.status).toBe(200);
  });

  it("name de más de 100 caracteres devuelve 400", async () => {
    const res = await request(app).get(`/characters?name=${"a".repeat(101)}`);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "name must be at most 100 characters" });
  });

  it("name de exactamente 100 caracteres no devuelve 400 (boundary)", async () => {
    mockUpstream(200, mockListResponse);

    const res = await request(app).get(`/characters?name=${"a".repeat(100)}`);

    expect(res.status).not.toBe(400);
  });

  it("fallo de red del upstream devuelve 500 sin filtrar detalles", async () => {
    mockUpstreamFailure();

    const res = await request(app).get("/characters?name=rick");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Upstream service unavailable" });
    expect(JSON.stringify(res.body)).not.toMatch(/network down|stack/i);
  });
});

describe("GET /characters/:id", () => {
  it("id válido devuelve 200 con el personaje", async () => {
    mockUpstream(200, mockCharacter);

    const res = await request(app).get("/characters/1");

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Rick Sanchez");
  });

  it("id numérico inexistente devuelve 404", async () => {
    mockUpstream(404, { error: "Character not found" });

    const res = await request(app).get("/characters/99999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Character not found" });
  });

  it("id no numérico devuelve 400 propio, nunca el 500 del upstream", async () => {
    const res = await request(app).get("/characters/abc");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "id must be a positive integer" });
    expect(JSON.stringify(res.body)).not.toMatch(/Hey! you must provide an id/);
  });

  it("id con cero a la izquierda (01) es aceptado como forma canónica relajada", async () => {
    mockUpstream(200, mockCharacter);

    const res = await request(app).get("/characters/01");

    expect(res.status).toBe(200);
  });

  it("id en notación científica (1e3) devuelve 400", async () => {
    const res = await request(app).get("/characters/1e3");

    expect(res.status).toBe(400);
  });

  it("fallo de red del upstream devuelve 500 sin filtrar detalles", async () => {
    mockUpstreamFailure();

    const res = await request(app).get("/characters/1");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Upstream service unavailable" });
  });
});

describe("rutas no encontradas", () => {
  it("GET /unknown devuelve 404 con contrato JSON {error}", async () => {
    const res = await request(app).get("/unknown");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Not found" });
  });
});
