import { useParams } from "react-router";
import { CharacterDetail } from "../components/CharacterDetail";
import { useBackToList } from "../hooks/useBackToList";
import { useCharacter } from "../hooks/useCharacter";

export function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const backToList = useBackToList();
  const { character, loading, error } = useCharacter(id);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <button
        type="button"
        onClick={backToList}
        className="mb-6 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        ← Volver
      </button>

      {loading && <p className="py-8 text-center text-slate-500">Cargando…</p>}
      {error && (
        <p role="alert" className="py-8 text-center text-red-600">
          {error}
        </p>
      )}
      {!loading && !error && character && <CharacterDetail character={character} />}
    </main>
  );
}
