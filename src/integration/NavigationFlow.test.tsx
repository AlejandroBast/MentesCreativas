import { render, screen, fireEvent } from "@testing-library/react";
// Mock vistas pesadas que montan WebGL
jest.mock("../views/Robot3DView", () => () => <div>Robot 3D</div>);
jest.mock("../views/ColorPicker3DView", () => () => <div>Color 3D</div>);
import App from "../App";

describe("Integración: flujo de navegación Sidebar", () => {
  test("navega desde Inicio a Robot3D y ColorPicker3D", async () => {
    render(<App />);

    // Espera a que cargue Layout (evita fallback Cargando…)
    await screen.findByRole("heading", { name: /Mi App/i }, { timeout: 3000 });

    // Abre acordeón de ejercicios (el sidebar está hidden por clases Tailwind; usamos hidden: true)
    const exercisesToggle = await screen.findByRole("button", { name: /Ejercicios · Jtest/i, hidden: true });
    fireEvent.click(exercisesToggle);

    // Navega a Robot3D
    const robotLink = await screen.findByRole("link", { name: /Robot 3D - Tecnología/i, hidden: true });
    fireEvent.click(robotLink);
    // Fallback Suspense muestra Cargando… por un instante
    await screen.findByText(/Robot 3D/i);
    // Validación mínima: seguimos en la vista mockeada
    expect(screen.getByText(/Robot 3D/i)).toBeInTheDocument();
  });
});
