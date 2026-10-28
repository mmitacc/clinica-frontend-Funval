import { useNavigate } from "react-router";

export default function PaginaSinAcceso() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center my-auto animate-in fade-in duration-300">
      {/* Ilustración o Icono grande con tonos de advertencia (Amber/Red) */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto mb-2 select-none">
        {/* 1. ICONO ARRIBA Y TRANSPARENTE: Candado de seguridad */}
        <div className="mb-4 p-3 bg-amber-500/10 text-amber-600 rounded-2xl border border-amber-500/20 flex items-center justify-center shrink-0">
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
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        {/* 2. TEXTO 403 GIGANTE: Código de estado para Acceso Prohibido */}
        <div className="text-[10rem] md:text-[12rem] font-black text-amber-600/10 tracking-tighter leading-none">
          403
        </div>
      </div>

      {/* Mensaje de Error */}
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
        No tienes permisos para esta sección.
      </h2>
      <p className="text-slate-500 max-w-sm mb-8 text-sm leading-relaxed">
        Tu rol actual no cuenta con los permisos necesarios para visualizar o
        gestionar la información de esta sección.
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
          className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-amber-600 rounded-xl shadow-sm shadow-amber-100 hover:bg-amber-700 active:scale-[0.98] transition-all"
        >
          Ir al Inicio
        </button>
      </div>
    </div>
  );
}
