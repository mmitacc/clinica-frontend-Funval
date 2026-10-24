import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface ReporteEspecialidad {
  especialidad: string;
  total: number;
}

interface DatoFlujoDia {
  fecha: string;
  total: number;
}

interface GraficaCitaEspecialidadProps {
  especialidades: ReporteEspecialidad[];
  flujoDias: DatoFlujoDia[];
}

export function GraficaCitaEspecialidad({
  especialidades,
  flujoDias,
}: GraficaCitaEspecialidadProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* GRÁFICA DE BARRAS: CITAS POR ESPECIALIDAD */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
        <h3 className="mb-4 font-semibold text-slate-700">
          Citas por Especialidad Médica
        </h3>

        {especialidades.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm border border-dashed rounded-lg bg-slate-50">
            No se encontraron registros de especialidades asignadas.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={especialidades}
              margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                dataKey="especialidad"
                angle={-25}
                textAnchor="end"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
              />
              <Bar
                dataKey="total"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
                name="Total Citas"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* GRÁFICA DE LÍNEAS: FLUJO DE CONSULTAS */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
        <h3 className="mb-4 font-semibold text-slate-700">
          Flujo Diario de Consultas (Últimos 7 Días Activos)
        </h3>

        {flujoDias.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm border border-dashed rounded-lg bg-slate-50">
            No hay volumen de datos suficiente para computar la tendencia
            diaria.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart
              data={flujoDias}
              margin={{ top: 10, right: 20, left: -20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                dataKey="fecha"
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ fontSize: "12px" }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={3}
                activeDot={{ r: 6 }}
                name="Volumen de Atenciones"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
