import { Link, useLocation } from "react-router";
import type { Character } from "../types";

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  const location = useLocation();

  return (
    <Link
      to={{ pathname: `/character/${character.id}`, search: location.search }}
      className="flex flex-col items-center rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:shadow-md"
    >
      <img
        src={character.image}
        alt={`Retrato de ${character.name}`}
        className="h-24 w-24 rounded-full object-cover"
      />
      <span className="mt-2 font-medium text-slate-900">{character.name}</span>
      <span className="text-sm text-slate-500">{character.status}</span>
    </Link>
  );
}
