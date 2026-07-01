import { Link, useLocation } from "react-router";
import type { Character } from "../types";
import { StatusBadge } from "./StatusBadge";

interface CharacterCardProps {
  character: Character;
  index?: number;
}

export function CharacterCard({ character, index = 0 }: CharacterCardProps) {
  const location = useLocation();

  return (
    <Link
      to={{ pathname: `/character/${character.id}`, search: location.search }}
      style={{ "--rm-i": index } as React.CSSProperties}
      className="rm-stagger-item group relative flex flex-col items-center overflow-hidden rounded-xl border border-portal-500/20 bg-space-800/70 p-4 text-center shadow-lg shadow-black/30 backdrop-blur-sm transition-all duration-300 [transform-style:preserve-3d] hover:-translate-y-1.5 hover:border-portal-400/60 hover:shadow-[0_0_24px_-4px_rgba(151,206,76,0.55)] focus-visible:-translate-y-1.5"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-portal-500/0 via-transparent to-cyan-glow/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:from-portal-500/10 group-hover:to-cyan-glow/10"
      />
      <div className="relative h-24 w-24 shrink-0">
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-portal-500/40 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-70"
        />
        <img
          src={character.image}
          alt={`Retrato de ${character.name}`}
          loading="lazy"
          className="relative h-24 w-24 rounded-full border-2 border-space-700 object-cover transition-transform duration-300 group-hover:scale-105 group-hover:border-portal-400/70"
        />
      </div>
      <span className="mt-3 line-clamp-1 font-display text-sm font-semibold text-slate-100 transition-colors group-hover:text-portal-300">
        {character.name}
      </span>
      <span className="mt-1.5">
        <StatusBadge status={character.status} />
      </span>
    </Link>
  );
}
