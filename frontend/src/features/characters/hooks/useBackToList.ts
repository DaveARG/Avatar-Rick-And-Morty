import { useLocation, useNavigate } from "react-router";

export function useBackToList(): () => void {
  const location = useLocation();
  const navigate = useNavigate();

  return function backToList() {
    // D-27 LOCKED: nunca navigate(-1) — el contexto de búsqueda viaja en la URL,
    // no en el historial, para sobrevivir deep-link/recarga.
    navigate({ pathname: "/", search: location.search });
  };
}
