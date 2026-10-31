import type { Metrica, Tendencia } from "../../types";

interface MetricCardProps {
  metrica: Metrica;
}

export function MetricCard({ metrica }: MetricCardProps) {
  // Configuración dinámica de estilos para los Badges según la tendencia
  const estilosPorTendencia: Record<
    Tendencia,
    { badge: string; punto: string; texto: string }
  > = {
    positiva: {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      punto: "bg-emerald-500 animate-pulse",
      texto: "Creciente vs ayer",
    },
    negativa: {
      badge: "bg-rose-50 text-rose-700 border-rose-200/60",
      punto: "bg-rose-500 animate-pulse",
      texto: "Decreciente vs ayer",
    },
    neutra: {
      badge: "bg-slate-50 text-slate-700 border-slate-200/60",
      punto: "bg-slate-400",
      texto: "Sin cambios vs ayer",
    },
  };

  const estiloActual =
    estilosPorTendencia[metrica.tendencia] || estilosPorTendencia.neutra;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 group">
      {/* Contenedor vertical: Icono arriba y Título abajo, ambos CENTRADOS */}
      <div className="flex flex-col items-center text-center gap-3">
        {/* Línea 1: El contenedor del icono en el medio */}
        <div className="flex h-11 w-11 items-center justify-center text-center leading-none rounded-xl bg-slate-50 text-xl text-slate-600 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110">
          {metrica.icono}
        </div>

        {/* Línea 2: El título centrado abajo del icono */}
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {metrica.titulo}
        </h3>
      </div>

      {/* Valor principal (Métrica gigante) */}
      <div className="mt-4">
        <span className="text-3xl font-black tracking-tight text-slate-900">
          {metrica.valor}
        </span>
      </div>

      {/* Descripción secundaria */}
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        {metrica.descripcion}
      </p>

      {/* Separador sutil interno */}
      <div className="my-4 border-t border-slate-100" />

      {/* Estado de Tendencia en formato Píldora/Badge */}
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide shadow-sm ${estiloActual.badge}`}
        >
          {/* Punto de notificación interactivo */}
          <span className={`h-1.5 w-1.5 rounded-full ${estiloActual.punto}`} />
          {estiloActual.texto}
        </span>
      </div>
    </div>
  );
}
