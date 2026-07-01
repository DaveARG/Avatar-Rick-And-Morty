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
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <h1
        className="mb-2 text-center font-display text-3xl font-black tracking-wide drop-shadow-[0_0_18px_rgba(151,206,76,0.5)] sm:text-5xl"
        style={{
          background: "linear-gradient(90deg, #97ce4c, #5fe0f5)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Rick and Morty Explorer
      </h1>
      <p className="mb-8 text-center text-sm text-slate-400 sm:text-base">
        Cruza el portal y encuentra a tu personaje favorito del multiverso.
      </p>
      <div className="mx-auto mb-8 max-w-lg">
        <SearchBar value={inputValue} onChange={setInputValue} />
      </div>
      <CharacterList characters={data?.results ?? []} loading={loading} error={error} />
      {!loading && !error && (data?.info.pages ?? 0) > 0 && (
        <Pagination page={page} totalPages={data?.info.pages ?? 0} onPageChange={setPage} />
      )}
    </main>
  );
}
