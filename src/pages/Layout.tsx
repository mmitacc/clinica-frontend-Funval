import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";
import { toast } from "sonner";
import ModalCambiarPassword from "../componets/ModalCambiarPassword";

export default function Layout() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalPasswordAbierto, setModalPasswordAbierto] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const usuario = useAuthStore((state) => state.usuario);
  const navigate = useNavigate();

  // Handdle para salir de sesión en el sistema
  const handleLogout = () => {
    logout();
    toast.info("Sesión cerrada correctamente.");
    navigate("/login", { replace: true });
  };

  // Lista de enlaces de navegación (agrega o modifica según tus rutas)
  const enlaces = [
    { to: "/pacientes", texto: "Pacientes", icono: "👥" },
    { to: "/reportes", texto: "Reportes", icono: "📊" },
    { to: "/citas/nueva", texto: "Agendar Cita", icono: "📅" },
    { to: "/consultas", texto: "Consultas Médicas", icono: "📋" },
    // { to: "/historial", texto: "Historial Clínico", icono: "📋" },
    { to: "/dashboard", texto: "Dashboard", icono: "⚙️" },
  ];

  // Estilo dinámico para los NavLinks activos de React Router
  const obtenerEstiloEnlace = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <div className="min-h-screen bg-amber-50/50 flex flex-col md:flex-row">
      {/* 📱 BARRA SUPERIOR PARA MÓVILES */}
      <header className="md:hidden bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          {/* Icono SVG estilizado en azul */}
          <div className="p-1.5 bg-blue-500 text-white rounded-lg shadow-sm shadow-blue-100 flex items-center justify-center shrink-0">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0a3 3 0 1 0-6 0m6 0a3 3 0 1 1-6 0m0 0V6a3 3 0 0 0-6 0v6m6 0H9"
              />
            </svg>
          </div>
          <span className="font-bold text-slate-900 tracking-tight">
            Clinica Funval
          </span>
        </div>
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg focus:outline-none"
        >
          {menuAbierto ? "✕" : "☰"}
        </button>
      </header>

      {/* 💻 SIDEBAR (Fijo en escritorio, colapsable en móvil) */}
      <aside
        className={`w-64 bg-amber-50/50 border-r border-slate-200/80 p-5 flex flex-col justify-between fixed md:sticky top-[57px] md:top-0 h-[calc(100vh-57px)] md:h-screen z-30 transition-transform duration-300 md:translate-x-0 ${
          menuAbierto ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Logo en Escritorio con SVG */}
          <div className="hidden bg-white md:flex items-center gap-2.5 px-2 py-1">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-200 flex items-center justify-center shrink-0">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              Clínica FUNVAL
            </span>
          </div>

          {/* Enlaces de Navegación */}
          <nav className="space-y-1.5">
            {enlaces.map((enlace) => (
              <NavLink
                key={enlace.to}
                to={enlace.to}
                onClick={() => setMenuAbierto(false)} // Cierra el menú móvil al hacer clic
                className={obtenerEstiloEnlace}
              >
                <span className="text-base shrink-0">{enlace.icono}</span>
                <span className="truncate">{enlace.texto}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* CONTENEDOR UNIFICADO ACCIONES DE LA CUENTA */}

        <div className="mt-auto p-2">
          <div className="bg-blue-50/60 border border-amber-200/80 rounded-xl p-3 shadow-inner space-y-1">
            {/* Encabezado del Usuario */}
            <div className="px-2 mb-2 border-b border-amber-200/40 pb-1">
              <p
                className="text-sm font-semibold text-blue-800 truncate"
                title={`${usuario?.role || "Personal"}: ${usuario?.username || "Usuario Clínico"}`}
              >
                {usuario?.role || "Personal"}:{" "}
                {usuario?.username || "Usuario Clínico"}
              </p>
            </div>

            {/* BOTÓN 1: Cambiar Contraseña */}
            <button
              onClick={() => setModalPasswordAbierto(true)}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-200 rounded-md transition-colors group"
            >
              <svg
                className="w-4 h-4 text-green-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://w3.org"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              New Password
            </button>

            {/* BOTÓN 2: Cerrar sesión */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-200 rounded-md transition-colors group"
            >
              <svg
                className="w-4 h-4 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://w3.org"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Cerrar Sesión
            </button>
          </div>

          {/* El componente del modal montado en la estructura */}
          <ModalCambiarPassword
            isOpen={modalPasswordAbierto}
            onClose={() => setModalPasswordAbierto(false)}
          />
        </div>

        {/* Footer del Sidebar opcional */}
        <div className="border-t pt-1 px-1 text-xs text-slate-400">
          v1.0.0 — mmitacc — ©2026
        </div>
      </aside>

      {/* 🔹 CONTENEDOR PRINCIPAL DINÁMICO */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        {/* Aquí React Router inyectará automáticamente la página activa */}
        <Outlet />
      </main>

      {/* Fondo oscuro traslúcido al abrir menú en móvil */}
      {menuAbierto && (
        <div
          onClick={() => setMenuAbierto(false)}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-20 md:hidden"
        />
      )}
    </div>
  );
}
