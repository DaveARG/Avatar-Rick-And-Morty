import { createBrowserRouter } from "react-router";
import { CharacterListPage } from "./features/characters/pages/CharacterListPage";
import { CharacterDetailPage } from "./features/characters/pages/CharacterDetailPage";

export const router = createBrowserRouter([
  { path: "/", Component: CharacterListPage },
  { path: "/character/:id", Component: CharacterDetailPage },
]);
