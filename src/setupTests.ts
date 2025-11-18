// Este archivo extiende el entorno de prueba de Jest.

import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Polyfill para TextEncoder/TextDecoder
if (typeof global.TextEncoder === "undefined") {
  (global as any).TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  (global as any).TextDecoder = TextDecoder;
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({ 
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

Object.defineProperty(window, "localStorage", {
  value: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    clear: jest.fn(),
    removeItem: jest.fn(),
  },
  writable: true,
});

const classSet = new Set<string>();
const mockClassList = {
  toggle: (value: string) => {
    const has = classSet.has(value);
    if (has) classSet.delete(value);
    else classSet.add(value);
    return !has;
  },
  add: (value: string) => classSet.add(value),
  remove: (value: string) => classSet.delete(value),
  contains: (value: string) => classSet.has(value),
};

Object.defineProperty(document, "documentElement", {
  value: {
    classList: mockClassList,
  },
  writable: true,
});

Object.defineProperty(document, "dispatchEvent", {
  value: jest.fn(),
});

// Mock global para evitar errores ESM de OrbitControls en tests de integración
jest.mock("three/examples/jsm/controls/OrbitControls", () => {
  class MockOrbitControls {
    enableDamping = false;
    enableZoom = true;
    target = { set: () => {} };
    update() {}
    dispose() {}
  }
  return { OrbitControls: MockOrbitControls };
});

jest.mock("three/examples/jsm/postprocessing/EffectComposer", () => {
  class MockComposer {
    setSize() {}
    render() {}
    addPass() {}
  }
  return { EffectComposer: MockComposer };
});
jest.mock("three/examples/jsm/postprocessing/RenderPass", () => {
  class MockRenderPass {
    constructor() {}
  }
  return { RenderPass: MockRenderPass };
});
jest.mock("three/examples/jsm/postprocessing/UnrealBloomPass", () => {
  class MockBloomPass {
    constructor() {}
  }
  return { UnrealBloomPass: MockBloomPass };
});
jest.mock("three/examples/jsm/postprocessing/OutlinePass", () => {
  class MockOutlinePass {
    selectedObjects = [] as any[];
    visibleEdgeColor = { set: () => {} } as any;
    hiddenEdgeColor = { set: () => {} } as any;
    setSize() {}
    constructor() {}
  }
  return { OutlinePass: MockOutlinePass };
});
jest.mock("three/examples/jsm/environments/RoomEnvironment", () => {
  class MockRoomEnvironment {}
  return { RoomEnvironment: MockRoomEnvironment };
});
jest.mock("./components/Robot3D", () => () => null);