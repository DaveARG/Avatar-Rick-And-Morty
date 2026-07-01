import type { Character } from "../types";
import { CharacterCard } from "./CharacterCard";

interface CharacterListProps {
  characters: Character[];
  loading: boolean;
  error: string | null;
}

export function CharacterList({ characters, loading, error }: CharacterListProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <div aria-hidden="true" className="relative h-20 w-20">
          <div className="rm-portal-loader absolute inset-0 rounded-full border-4 border-dashed border-portal-400/70" />
          <div className="rm-portal-loader-core absolute inset-3 rounded-full bg-portal-500/70 blur-[2px]" />
        </div>
        <p role="status" className="font-display text-sm tracking-wide text-portal-300">
          Cargando…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <p role="alert" className="py-8 text-center text-lg text-red-300">
        <span aria-hidden="true" className="mb-2 block text-4xl">
          (╯°□°)╯
        </span>
        Error: {error}
      </p>
    );
  }

  if (characters.length === 0) {
    return (
      <p className="py-16 text-center text-slate-300">
        <span aria-hidden="true" className="mb-3 block text-5xl">
          ¯\_(ツ)_/¯
        </span>
        No se encontraron personajes.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {characters.map((character, index) => (
        <CharacterCard key={character.id} character={character} index={index} />
      ))}
    </div>
  );
}
