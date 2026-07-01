import type { Character } from "../types";

interface CharacterDetailProps {
  character: Character;
}

export function CharacterDetail({ character }: CharacterDetailProps) {
  return (
    <article className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <img
        src={character.image}
        alt={`Retrato de ${character.name}`}
        className="mx-auto h-48 w-48 rounded-full object-cover"
      />
      <h1 className="mt-4 text-center text-2xl font-bold text-slate-900">{character.name}</h1>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <dt className="font-medium text-slate-500">Estado</dt>
        <dd className="text-slate-900">{character.status}</dd>

        <dt className="font-medium text-slate-500">Especie</dt>
        <dd className="text-slate-900">{character.species}</dd>

        <dt className="font-medium text-slate-500">Género</dt>
        <dd className="text-slate-900">{character.gender}</dd>

        <dt className="font-medium text-slate-500">Origen</dt>
        <dd className="text-slate-900">{character.origin.name}</dd>

        <dt className="font-medium text-slate-500">Ubicación</dt>
        <dd className="text-slate-900">{character.location.name}</dd>

        <dt className="font-medium text-slate-500">Episodios</dt>
        <dd className="text-slate-900">{character.episode.length}</dd>
      </dl>
    </article>
  );
}
