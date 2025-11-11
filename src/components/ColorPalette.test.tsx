import { render, screen, fireEvent } from "@testing-library/react";
import ColorPalette from "./ColorPalette";

describe("ColorPalette", () => {
	test("renderiza botones preestablecidos y dispara onSetHex al hacer clic", () => {
		const handleSet = jest.fn();
		render(
			<ColorPalette
				currentHex="#ff0000"
				onSetHex={handleSet}
				onRandom={jest.fn()}
				onReset={jest.fn()}
			/>
		);

		// Los tres presets (Rojo, Verde, Azul) se renderizan como buttons con role default
		const presetButtons = screen.getAllByRole("button");
		expect(presetButtons.length).toBeGreaterThanOrEqual(3);

		// Click en el primer botón debe invocar callback
		fireEvent.click(presetButtons[0]);
		expect(handleSet).toHaveBeenCalledTimes(1);
		// El valor hexadecimal recibido debe ser un número
		expect(typeof handleSet.mock.calls[0][0]).toBe("number");
	});

	test("cambia el input de color y actualiza onSetHex cuando el hex es válido", () => {
		const handleSet = jest.fn();
		render(
			<ColorPalette
				currentHex="#123456"
				onSetHex={handleSet}
				onRandom={jest.fn()}
				onReset={jest.fn()}
			/>
		);

		const hexInput = screen.getByLabelText(/Código HEX/i) as HTMLInputElement;
		fireEvent.change(hexInput, { target: { value: "#abcdef" } });
		expect(handleSet).toHaveBeenCalledWith(parseInt("abcdef", 16));
	});

	test("botón copiar intenta escribir en el portapapeles", async () => {
		const writeText = jest.fn().mockResolvedValue(undefined);
		(navigator as any).clipboard = { writeText };

		render(
			<ColorPalette
				currentHex="#654321"
				onSetHex={jest.fn()}
				onRandom={jest.fn()}
				onReset={jest.fn()}
			/>
		);

		const copyBtn = screen.getByRole("button", { name: /copiar/i });
		fireEvent.click(copyBtn);
		expect(writeText).toHaveBeenCalledWith("#654321".toUpperCase());
	});
});

