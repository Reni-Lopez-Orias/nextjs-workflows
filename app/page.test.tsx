import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./page";

describe("Home", () => {
  it("muestra el mensaje de vacio cuando no hay tareas", async () => {
    render(<Home />);

    expect(await screen.findByText(/no hay tareas/i)).toBeInTheDocument();
  });

  it("crea una tarea y la guarda en localStorage", async () => {
    const user = userEvent.setup();
    render(<Home />);
    await screen.findByText(/no hay tareas/i);

    await user.type(screen.getByPlaceholderText("Título"), "Comprar pan");
    await user.click(screen.getByRole("button", { name: /agregar/i }));

    expect(await screen.findByText("Comprar pan")).toBeInTheDocument();
    expect(window.localStorage.getItem("tareas")).toContain("Comprar pan");
  });

  it("alterna el estado al hacer click en la tarea", async () => {
    const user = userEvent.setup();
    render(<Home />);
    await screen.findByText(/no hay tareas/i);

    await user.type(screen.getByPlaceholderText("Título"), "Comprar pan");
    await user.click(screen.getByRole("button", { name: /agregar/i }));

    const item = await screen.findByText("Comprar pan");
    await user.click(item);

    // CSS Modules escala el nombre de la clase (ej. "_hecha_00c8fe"), por eso
    // se busca como substring en vez de con toHaveClass (que exige exacto).
    expect(item.closest("li")?.className).toMatch(/hecha/);
  });

  it("elimina una tarea", async () => {
    const user = userEvent.setup();
    render(<Home />);
    await screen.findByText(/no hay tareas/i);

    await user.type(screen.getByPlaceholderText("Título"), "Comprar pan");
    await user.click(screen.getByRole("button", { name: /agregar/i }));
    await screen.findByText("Comprar pan");

    await user.click(
      screen.getByRole("button", { name: /eliminar comprar pan/i }),
    );

    expect(screen.queryByText("Comprar pan")).not.toBeInTheDocument();
    expect(await screen.findByText(/no hay tareas/i)).toBeInTheDocument();
  });

  it("recupera las tareas guardadas en localStorage al volver a montar", async () => {
    const { unmount } = render(<Home />);
    const user = userEvent.setup();
    await screen.findByText(/no hay tareas/i);

    await user.type(screen.getByPlaceholderText("Título"), "Comprar pan");
    await user.click(screen.getByRole("button", { name: /agregar/i }));
    await screen.findByText("Comprar pan");
    unmount();

    render(<Home />);
    expect(await screen.findByText("Comprar pan")).toBeInTheDocument();
  });
});
