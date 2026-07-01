import type { ApiError, Character, CharacterListResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

async function parseJsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body: ApiError = await res.json();
    throw new Error(body.error);
  }
  return res.json() as Promise<T>;
}

export async function searchCharacters(
  name: string,
  page: number,
): Promise<CharacterListResponse> {
  const params = new URLSearchParams({ page: String(page) });
  if (name !== "") {
    params.set("name", name);
  }
  const res = await fetch(`${API_URL}/characters?${params.toString()}`);
  return parseJsonOrThrow<CharacterListResponse>(res);
}

export async function getCharacter(id: number): Promise<Character> {
  const res = await fetch(`${API_URL}/characters/${id}`);
  return parseJsonOrThrow<Character>(res);
}
