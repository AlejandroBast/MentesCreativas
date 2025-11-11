import { Outlet } from "react-router-dom" ;
import Sidebar from "./Sidebar";    
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenedor principal */}
      <div className="flex flex-col flex-1">
        {/* Navbar arriba */}
        <Navbar />

        {/* Contenido dinámico (cada vista) */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gradient-to-br from-sky-50 via-sky-100 to-sky-50 dark:from-sky-900 dark:via-sky-800 dark:to-sky-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
