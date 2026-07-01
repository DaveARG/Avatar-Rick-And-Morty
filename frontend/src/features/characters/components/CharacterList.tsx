import type { Character } from "../types";
import { CharacterCard } from "./CharacterCard";

interface CharacterListProps {
  characters: Character[];
  loading: boolean;
  error: string | null;
}

export function CharacterList({ characters, loading, error }: CharacterListProps) {
  if (loading) {
    return <p className="py-8 text-center text-slate-500">Cargando…</p>;
  }

  if (error) {
    return <p className="py-8 text-center text-red-600">Error: {error}</p>;
  }

  if (characters.length === 0) {
    return (
      <p className="py-8 text-center text-slate-500">
        No se encontraron personajes.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
}
