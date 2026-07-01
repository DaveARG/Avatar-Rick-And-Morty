import { useSearchParams } from "react-router";

export interface CharacterSearchParams {
  name: string;
  page: number;
  setName: (name: string) => void;
  setPage: (page: number) => void;
}

export function useCharacterSearchParams(): CharacterSearchParams {
  const [searchParams, setSearchParams] = useSearchParams();

  const name = searchParams.get("name") ?? "";
  const page = Number(searchParams.get("page")) || 1;

  const setName = (newName: string) => {
    setSearchParams({ name: newName, page: "1" });
  };

  const setPage = (newPage: number) => {
    setSearchParams({ name, page: String(newPage) });
  };

  return { name, page, setName, setPage };
}
