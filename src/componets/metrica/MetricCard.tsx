import type { Metrica, Tendencia } from "../../types";
interface MetricCardProps {
  metrica: Metrica;
}

export function MetricCard({ metrica }: MetricCardProps) {
  const colorPorTendencia: Record<Tendencia, string> = {
    positiva: "text-emerald-600",
    negativa: "text-rose-600",
    neutra: "text-slate-600",
  };
  return (
    <div>
      <h3 className="mt-6 mb-2 text-2xl font-semibold tracking-tight text-heading">
        {metrica.titulo}
      </h3>
      <h3 className="mt-2 mb-2 font-semibold tracking-tight text-heading">
        {metrica.valor}
      </h3>
      <p className="mb-2 text-body">{metrica.descripcion}</p>
      <h6 className={colorPorTendencia[metrica.tendencia]}>
        Tendencia: {metrica.tendencia}
      </h6>
      <h6 className="mb-2 text-body">{metrica.icono}</h6>
    </div>
  );
}
