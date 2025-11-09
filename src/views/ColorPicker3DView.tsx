// src/views/ColorPicker3DView.tsx
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ColorPalette from "../components/ColorPalette";

const STORAGE_KEY = "mc_color3d_hex";
const DEFAULT_HEX = 0x22c55e;

export default function ColorPicker3DView() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const meshRef = useRef<THREE.Object3D | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const [model, setModel] = useState<"pizza" | "pastel">("pizza");
  const [currentHex, setCurrentHex] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? saved : DEFAULT_HEX.toString(16).padStart(6, "0");
  });

  useEffect(() => {
    if (!stageRef.current) return;

    const stage = stageRef.current;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    renderer.setClearColor(0xf8fafc, 1);
    stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, stage.clientWidth / stage.clientHeight, 0.1, 100);
    camera.position.set(2.5, 2.0, 3.0);
    camera.lookAt(0, 0, 0);

  // Orbit controls (rotation via mouse + zoom)
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = true;
  controls.target.set(0, 0.2, 0);
  controls.update();

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 5, 5);
    scene.add(dir);

    // create initial model (pizza or pastel)
    const createModel = (m: "pizza" | "pastel") => {
      // remove previous
      if (meshRef.current) {
        scene.remove(meshRef.current);
        // dispose geometries/materials if available
        meshRef.current.traverse((c: any) => {
          if (c.geometry) c.geometry.dispose();
          if (c.material) c.material.dispose();
        });
        meshRef.current = null;
      }

      if (m === "pizza") {
        const geom = new THREE.CylinderGeometry(0.9, 0.9, 0.08, 64);
        const mat = new THREE.MeshStandardMaterial({ color: parseInt(currentHex, 16) });
        const pizza = new THREE.Mesh(geom, mat);
        pizza.position.y = 0.04;
        meshRef.current = pizza;
        materialRef.current = mat;
        scene.add(pizza);
      } else {
        // pastel: base + top (frosting)
        const group = new THREE.Group();
        const baseGeom = new THREE.CylinderGeometry(0.9, 0.9, 0.5, 64);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0xffd1a9 });
        const base = new THREE.Mesh(baseGeom, baseMat);
        base.position.y = 0.25;

        const topGeom = new THREE.CylinderGeometry(0.8, 0.8, 0.12, 64);
        const topMat = new THREE.MeshStandardMaterial({ color: parseInt(currentHex, 16) });
        const top = new THREE.Mesh(topGeom, topMat);
        top.position.y = 0.5 + 0.06;

        group.add(base);
        group.add(top);
        meshRef.current = group;
        materialRef.current = topMat; // top material receives color changes
        scene.add(group);
      }
    };

    sceneRef.current = scene;
    createModel(model);

    let running = true;
    const animate = () => {
      if (!running) return;
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(stage);

    return () => {
      running = false;
      // dispose mesh geometry/material
      if (meshRef.current) {
        meshRef.current.traverse((c: any) => {
          if (c.geometry) c.geometry.dispose();
          if (c.material) c.material.dispose();
        });
      }
      controls.dispose();
      renderer.dispose();
      ro.disconnect();
      stage.removeChild(renderer.domElement);
    };
  }, []); // mount only

  // keep material color in sync when currentHex changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.set(`#${currentHex}`);
    }
    try {
      localStorage.setItem(STORAGE_KEY, currentHex);
    } catch (e) {
      // ignore storage errors
    }
  }, [currentHex]);

  // Replace model when model state changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // createModel needs access to currentHex and sceneRef; implement inline
    // remove previous
    if (meshRef.current) {
      scene.remove(meshRef.current);
      meshRef.current.traverse((c: any) => {
        if (c.geometry) c.geometry.dispose();
        if (c.material) c.material.dispose();
      });
      meshRef.current = null;
    }

    if (model === "pizza") {
      const geom = new THREE.CylinderGeometry(0.9, 0.9, 0.08, 64);
      const mat = new THREE.MeshStandardMaterial({ color: parseInt(currentHex, 16) });
      const pizza = new THREE.Mesh(geom, mat);
      pizza.position.y = 0.04;
      meshRef.current = pizza;
      materialRef.current = mat;
      scene.add(pizza);
    } else {
      const group = new THREE.Group();
      const baseGeom = new THREE.CylinderGeometry(0.9, 0.9, 0.5, 64);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0xffd1a9 });
      const base = new THREE.Mesh(baseGeom, baseMat);
      base.position.y = 0.25;

      const topGeom = new THREE.CylinderGeometry(0.8, 0.8, 0.12, 64);
      const topMat = new THREE.MeshStandardMaterial({ color: parseInt(currentHex, 16) });
      const top = new THREE.Mesh(topGeom, topMat);
      top.position.y = 0.5 + 0.06;

      group.add(base);
      group.add(top);
      meshRef.current = group;
      materialRef.current = topMat;
      scene.add(group);
    }
  }, [model]);

  const setColor = (hex: number) => {
    const hexStr = hex.toString(16).padStart(6, "0");
    setCurrentHex(hexStr);
  };

  const setRandomColor = () => {
    const c = new THREE.Color(Math.random(), Math.random(), Math.random());
    const hexStr = c.getHexString();
    setCurrentHex(hexStr);
  };

  const resetColor = () => {
    const def = DEFAULT_HEX.toString(16).padStart(6, "0");
    setCurrentHex(def);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Cambiar color 3D</h2>

      <div className="flex items-center gap-4">
        <ColorPalette currentHex={currentHex} onSetHex={setColor} onRandom={setRandomColor} onReset={resetColor} currentModel={model} onSetModel={(m) => setModel(m)} />
      </div>

      <div ref={stageRef} className="w-full h-[420px] border bg-white" aria-label="Escena 3D" />
    </div>
  );
}
