import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { CharacterDetail } from "../components/CharacterDetail";
import { getCharacter } from "../services/characters.service";
import type { Character } from "../types";

export function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

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
  }, [id]);

  function handleBack() {
    // D-27 LOCKED: nunca navigate(-1) — el contexto de búsqueda viaja en la URL,
    // no en el historial, para sobrevivir deep-link/recarga.
    navigate({ pathname: "/", search: location.search });
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <button
        type="button"
        onClick={handleBack}
        className="mb-6 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        ← Volver
      </button>

      {loading && <p className="py-8 text-center text-slate-500">Cargando…</p>}
      {error && (
        <p className="py-8 text-center text-red-600">Error: {error}</p>
      )}
      {!loading && !error && character && (
        <CharacterDetail character={character} />
      )}
    </main>
  );
}
