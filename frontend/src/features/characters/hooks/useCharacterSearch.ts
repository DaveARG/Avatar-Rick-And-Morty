import { useEffect, useState } from "react";
import { searchCharacters } from "../services/characters.service";
import type { CharacterListResponse } from "../types";

export interface UseCharacterSearchResult {
  data: CharacterListResponse | null;
  loading: boolean;
  error: string | null;
}

export function useCharacterSearch(name: string, page: number): UseCharacterSearchResult {
  const [data, setData] = useState<CharacterListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    searchCharacters(name, page)
      .then((response) => {
        if (!cancelled) setData(response);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error desconocido");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [name, page]);

  return { data, loading, error };
}
