import { useNavigate } from "react-router"; // Importación directa de react-router

export default function PaginaNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center my-auto animate-in fade-in duration-300">
      {/* Ilustración o Icono grande con tonos azules */}
      <div className="relative mb-6">
        <div className="text-9xl font-extrabold text-blue-600/10 tracking-widest select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-bold text-blue-600">🩺</span>
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
      <div className="flex flex-col sm:flex-row items-center gap-3">
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
