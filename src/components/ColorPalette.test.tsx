import { render, screen, fireEvent } from "@testing-library/react";
import ColorPalette from "./ColorPalette";

const withClipboardMock = () => {
  const originalClipboard = navigator.clipboard;
  const clipboardMock = { writeText: jest.fn().mockResolvedValue(undefined) };

  beforeAll(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: clipboardMock,
      configurable: true,
    });
  });

  afterAll(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: originalClipboard,
    });
  });

  return clipboardMock;
};

describe("ColorPalette", () => {
  const renderPalette = () => {
    const handlers = {
      onSetHex: jest.fn(),
      onRandom: jest.fn(),
      onReset: jest.fn(),
    };

    render(
      <ColorPalette
        currentHex="#123456"
        onSetHex={handlers.onSetHex}
        onRandom={handlers.onRandom}
        onReset={handlers.onReset}
      />
    );

    return handlers;
  };

  withClipboardMock();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("asocia la etiqueta Código HEX con el input y dispara onSetHex con el valor válido", () => {
    const handlers = renderPalette();
    const hexInput = screen.getByLabelText(/Código HEX/i);
    fireEvent.change(hexInput, { target: { value: "#abcdef" } });
    expect(handlers.onSetHex).toHaveBeenCalledWith(parseInt("abcdef", 16));
  });

  test("los botones Random y Reset llaman a sus callbacks", () => {
    const handlers = renderPalette();
    fireEvent.click(screen.getByRole("button", { name: /Random/i }));
    fireEvent.click(screen.getByRole("button", { name: /Reset/i }));
    expect(handlers.onRandom).toHaveBeenCalled();
    expect(handlers.onReset).toHaveBeenCalled();
  });

  test("clic en preset Rojo dispara onSetHex con el valor correcto", () => {
    const handlers = renderPalette();
    fireEvent.click(screen.getByTitle(/Rojo/i));
    expect(handlers.onSetHex).toHaveBeenCalledWith(0xff4d4f);
  });
});
