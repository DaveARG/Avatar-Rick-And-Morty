import { useEffect, useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { CharacterList } from "../components/CharacterList";
import { Pagination } from "../components/Pagination";
import { useCharacterSearch } from "../hooks/useCharacterSearch";
import { useCharacterSearchParams } from "../hooks/useCharacterSearchParams";
import { useDebounce } from "../hooks/useDebounce";

export function CharacterListPage() {
  const { name, page, setName, setPage } = useCharacterSearchParams();

  // Estado local del input: el tipeo es instantáneo y nunca se re-renderiza
  // con un valor viejo mientras la URL (async, vía react-router) se pone al día.
  const [inputValue, setInputValue] = useState(name);
  const debouncedInputValue = useDebounce(inputValue, 300);

  // Sync URL -> input: deep-link, "volver" del detalle, navegación por historial.
  useEffect(() => {
    setInputValue(name);
  }, [name]);

  // Sync input -> URL (debounced): dispara la búsqueda y resetea page a 1.
  useEffect(() => {
    if (debouncedInputValue !== name) {
      setName(debouncedInputValue);
    }
  }, [debouncedInputValue, name, setName]);

  const { data, loading, error } = useCharacterSearch(name, page);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold text-slate-900">
        Rick and Morty Explorer
      </h1>
      <div className="mb-6">
        <SearchBar value={inputValue} onChange={setInputValue} />
      </div>
      <CharacterList characters={data?.results ?? []} loading={loading} error={error} />
      {!loading && !error && (data?.info.pages ?? 0) > 0 && (
        <Pagination page={page} totalPages={data?.info.pages ?? 0} onPageChange={setPage} />
      )}
    </main>
  );
}
