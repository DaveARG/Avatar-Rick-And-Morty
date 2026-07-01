import { useEffect, useState } from "react";
import { getCharacter, HttpError } from "../services/characters.service";
import type { Character } from "../types";

const NOT_FOUND_MESSAGE = "Personaje no encontrado";
const GENERIC_ERROR_MESSAGE = "Ocurrió un error al cargar el personaje. Intentá de nuevo";

export interface UseCharacterResult {
  character: Character | null;
  loading: boolean;
  error: string | null;
}

export function useCharacter(id: string | undefined): UseCharacterResult {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getCharacter(Number(id))
      .then((data) => {
        if (!cancelled) setCharacter(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof HttpError && err.status === 404
            ? NOT_FOUND_MESSAGE
            : GENERIC_ERROR_MESSAGE;
        setError(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { character, loading, error };
}
