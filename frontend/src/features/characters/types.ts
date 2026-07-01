export type CharacterStatus = "Alive" | "Dead" | "unknown";

export interface NamedResource {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string;
  gender: string;
  origin: NamedResource;
  location: NamedResource;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface CharacterListInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface CharacterListResponse {
  info: CharacterListInfo;
  results: Character[];
}

export interface ApiError {
  error: string;
}
