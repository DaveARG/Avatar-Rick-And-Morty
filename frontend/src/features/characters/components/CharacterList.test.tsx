import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CharacterList } from "./CharacterList";

describe("CharacterList", () => {
  it("muestra el estado sin-resultados cuando la lista está vacía", () => {
    render(<CharacterList characters={[]} loading={false} error={null} />);

    expect(screen.getByText("No se encontraron personajes.")).toBeInTheDocument();
  });

  it("muestra el estado de carga", () => {
    render(<CharacterList characters={[]} loading={true} error={null} />);

    expect(screen.getByText("Cargando…")).toBeInTheDocument();
  });

  it("muestra el estado de error", () => {
    render(<CharacterList characters={[]} loading={false} error="Upstream service unavailable" />);

    expect(screen.getByText("Error: Upstream service unavailable")).toBeInTheDocument();
  });
});
