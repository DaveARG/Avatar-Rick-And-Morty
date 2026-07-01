import { useParams } from "react-router";
import { CharacterDetail } from "../components/CharacterDetail";
import { useBackToList } from "../hooks/useBackToList";
import { useCharacter } from "../hooks/useCharacter";

export function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const backToList = useBackToList();
  const { character, loading, error } = useCharacter(id);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <button
        type="button"
        onClick={backToList}
        className="mb-8 rounded-full border border-portal-500/30 bg-space-800/70 px-4 py-2 text-sm font-medium text-slate-100 transition-all duration-200 hover:-translate-x-0.5 hover:border-portal-400/70 hover:text-portal-300 hover:shadow-[0_0_16px_-4px_rgba(151,206,76,0.5)]"
      >
        ← Volver
      </button>

      {loading && (
        <div className="flex flex-col items-center gap-4 py-16">
          <div aria-hidden="true" className="relative h-20 w-20">
            <div className="rm-portal-loader absolute inset-0 rounded-full border-4 border-dashed border-portal-400/70" />
            <div className="rm-portal-loader-core absolute inset-3 rounded-full bg-portal-500/70 blur-[2px]" />
          </div>
          <p role="status" className="font-display text-sm tracking-wide text-portal-300">
            Cargando…
          </p>
        </div>
      )}
      {error && (
        <p role="alert" className="py-8 text-center text-lg text-red-300">
          <span aria-hidden="true" className="mb-2 block text-4xl">
            (╯°□°)╯
          </span>
          {error}
        </p>
      )}
      {!loading && !error && character && <CharacterDetail character={character} />}
    </main>
  );
}
