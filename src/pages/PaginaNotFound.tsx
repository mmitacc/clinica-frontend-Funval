import { useNavigate } from "react-router"; // Importación directa de react-router

export default function PaginaNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center my-auto animate-in fade-in duration-300">
      {/* Ilustración o Icono grande con tonos azules */}
      {/* Contenedor principal de la ilustración 404 */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto mb-2 select-none">
        {/* 1. ICONO ARRIBA Y TRANSPARENTE: Con bordes finos y fondo sutil */}
        <div className="mb-4 p-3 bg-blue-500/10 text-blue-600 rounded-2xl border border-blue-500/20 flex items-center justify-center shrink-0">
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

        {/* 2. TEXTO 404 GIGANTE: Ocupando el centro del bloque */}
        <div className="text-[10rem] md:text-[12rem] font-black text-blue-600/10 tracking-tighter leading-none">
          404
        </div>
      </div>

      {/* Mensaje de Error */}
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
        Página no encontrada
      </h2>
      <p className="text-slate-500 max-w-sm mb-8 text-sm leading-relaxed">
        Lo sentimos, la sección que estás buscando no existe o ha sido movida
        temporalmente.
      </p>

      {/* Botones de Acción */}
      <div className="flex flex-col sm:flex-row items-center p-10 gap-3">
        <button
          onClick={() => navigate(-1)} // Vuelve a la página anterior
          className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all"
        >
          Volver atrás
        </button>
        <button
          onClick={() => navigate("/dashboard")} // Te lleva al inicio de la app
          className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-sm shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all"
        >
          Ir al Inicio
        </button>
      </div>
    </div>
  );
}
