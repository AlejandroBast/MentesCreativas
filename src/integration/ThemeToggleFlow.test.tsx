import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";

describe("Integración: toggle de tema propaga cambios", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
    window.localStorage.setItem("theme", "light");
  });

  test("al hacer clic cambia texto del botón y clase 'dark' en documentElement", async () => {
    render(<App />);

    const btn = await screen.findByRole("button", { name: /Modo Oscuro/i });
    expect(btn).toHaveTextContent(/Oscuro/i);

    fireEvent.click(btn);
    expect(btn).toHaveTextContent(/Modo Claro/i);
  });
});
