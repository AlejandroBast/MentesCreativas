import { render, screen } from "@testing-library/react";
import App from "../App";

describe("Integración: indicador del tema activo", () => {
  beforeEach(() => {
    window.localStorage.removeItem("theme");
    document.documentElement.classList.remove("dark");
    if (document.documentElement.dataset) {
      delete document.documentElement.dataset.theme;
    }
  });

  test("muestra que está en modo oscuro cuando la preferencia previa es dark", async () => {
    const getItemSpy = jest.spyOn(window.localStorage, "getItem").mockReturnValue("dark");

    render(<App />);

    const indicator = await screen.findByText(/Modo Oscuro/i);
    expect(indicator).toBeInTheDocument();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    getItemSpy.mockRestore();
  });
});
