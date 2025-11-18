import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";

const isTest = process.env.NODE_ENV === "test";

const req = (p: string) => {
  const mod = require(p);
  return mod?.default ?? mod;
};

const HomePage = isTest ? req("../views/HomePage") : lazy(() => import("../views/HomePage"));
const SettingsView = isTest ? req("../views/SettingsView") : lazy(() => import("../views/SettingsView"));
const ColorPicker3DView = isTest ? req("../views/ColorPicker3DView") : lazy(() => import("../views/ColorPicker3DView"));
const Robot3DView = isTest ? req("../views/Robot3DView") : lazy(() => import("../views/Robot3DView"));
const WaterCycleView = isTest ? req("../views/WaterCycleView") : lazy(() => import("../views/WaterCycleView"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-500">Cargando…</div>}>
      <Routes>
        <Route path="/" element={<Layout />}>                                
          <Route index element={<HomePage />} />                             
          <Route path="color3d" element={<ColorPicker3DView />} />
          <Route path="robot3d" element={<Robot3DView />} />
          <Route path="watercycle" element={<WaterCycleView />} />
          <Route path="settings" element={<SettingsView />} />
        </Route>
      </Routes>
    </Suspense>
  );
}