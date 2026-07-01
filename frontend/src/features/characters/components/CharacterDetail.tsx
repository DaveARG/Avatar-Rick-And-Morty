import type { Character } from "../types";
import { StatusBadge } from "./StatusBadge";

interface CharacterDetailProps {
  character: Character;
}

const DETAIL_FIELDS: Array<{ label: string; value: (c: Character) => string }> = [
  { label: "Especie", value: (c) => c.species },
  { label: "Género", value: (c) => c.gender },
  { label: "Origen", value: (c) => c.origin.name },
  { label: "Ubicación", value: (c) => c.location.name },
  { label: "Episodios", value: (c) => String(c.episode.length) },
];

export function CharacterDetail({ character }: CharacterDetailProps) {
  return (
    <article className="mx-auto max-w-xl animate-[rm-fade-up_0.5s_cubic-bezier(0.16,1,0.3,1)_both] overflow-hidden rounded-2xl border border-portal-500/25 bg-space-800/70 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-8">
      <div className="relative mx-auto h-40 w-40 sm:h-48 sm:w-48">
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-portal-500/50 blur-xl"
        />
        <img
          src={character.image}
          alt={`Retrato de ${character.name}`}
          className="relative h-full w-full rounded-full border-4 border-portal-400/60 object-cover shadow-[0_0_30px_-4px_rgba(151,206,76,0.6)]"
        />
      </div>

      <h1 className="mt-5 text-center font-display text-2xl font-bold text-slate-50 [text-shadow:0_0_18px_rgba(151,206,76,0.45)] sm:text-3xl">
        {character.name}
      </h1>

      <div className="mt-3 flex justify-center">
        <StatusBadge status={character.status} />
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {DETAIL_FIELDS.map((field) => (
          <div
            key={field.label}
            className="rounded-lg border border-cyan-glow/15 bg-space-900/50 px-4 py-3"
          >
            <dt className="text-xs font-medium tracking-wide text-cyan-soft uppercase">
              {field.label}
            </dt>
            <dd className="mt-1 text-sm text-slate-100">{field.value(character)}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
