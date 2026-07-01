import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HttpError } from "../services/characters.service";

const { getCharacterMock } = vi.hoisted(() => ({
  getCharacterMock: vi.fn(),
}));

vi.mock("../services/characters.service", async () => {
  const actual = await vi.importActual<typeof import("../services/characters.service")>(
    "../services/characters.service",
  );
  return { ...actual, getCharacter: getCharacterMock };
});

import { useCharacter } from "./useCharacter";

describe("useCharacter", () => {
  it("expone 'Personaje no encontrado' ante un 404", async () => {
    getCharacterMock.mockRejectedValueOnce(new HttpError("Not found", 404));

    const { result } = renderHook(() => useCharacter("999"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Personaje no encontrado");
    expect(result.current.character).toBeNull();
  });

  it("expone un mensaje genérico ante un error 500", async () => {
    getCharacterMock.mockRejectedValueOnce(new HttpError("Boom", 500));

    const { result } = renderHook(() => useCharacter("1"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Ocurrió un error al cargar el personaje. Intentá de nuevo");
  });
});
