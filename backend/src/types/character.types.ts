export type CharacterStatus = "Alive" | "Dead" | "unknown";

export interface NamedResource {
  name: string;
  url: string; // puede ser "" cuando el lugar es "unknown"
}

export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string; // "" cuando no aplica
  gender: string;
  origin: NamedResource;
  location: NamedResource;
  image: string;
  episode: string[]; // URLs, no IDs
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

export interface ApiErrorBody {
  error: string;
}
