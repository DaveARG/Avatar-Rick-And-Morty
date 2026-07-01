import { useEffect, useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { CharacterList } from "../components/CharacterList";
import { Pagination } from "../components/Pagination";
import { useCharacterSearchParams } from "../hooks/useCharacterSearchParams";
import { useDebounce } from "../hooks/useDebounce";
import { searchCharacters } from "../services/characters.service";
import type { CharacterListResponse } from "../types";

export function CharacterListPage() {
  const { name, page, setName, setPage } = useCharacterSearchParams();
  const debouncedName = useDebounce(name, 300);

  const [data, setData] = useState<CharacterListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    searchCharacters(debouncedName, page)
      .then((response) => {
        if (!cancelled) setData(response);
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
  }, [debouncedName, page]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold text-slate-900">
        Rick and Morty Explorer
      </h1>
      <div className="mb-6">
        <SearchBar value={name} onChange={setName} />
      </div>
      <CharacterList
        characters={data?.results ?? []}
        loading={loading}
        error={error}
      />
      {!loading && !error && (data?.info.pages ?? 0) > 0 && (
        <Pagination
          page={page}
          totalPages={data?.info.pages ?? 0}
          onPageChange={setPage}
        />
      )}
    </main>
  );
}
