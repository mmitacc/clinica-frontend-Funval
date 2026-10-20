import { useEffect, useState } from "react";
import { MetricCard } from "../componets/metrica/MetricCard";
import { StatusBadge } from "../componets/metrica/StatusBadge";
import type { Metrica } from "../types";
import type { Consulta } from "../types/Consulta";
import { api } from "../lib/axios";

export function PaginaDashboard() {
  // Estado global del sistema, para interactuar con StatusBadge
  const [enMantenimiento, setEnMantenimiento] = useState<boolean>(false);

  // Estado para los pacientes registrados
  const [totalPacientes, setTotalPacientes] = useState<number>(0);
  useEffect(() => {
    api.get("/pacientes").then((res) => {
      setTotalPacientes(res.data.total ?? 0);
    });
  }, []);

  // Estado para los citas registradas
  const [totalConsultas, setTotalConsultas] = useState<Consulta[]>([]);
  useEffect(() => {
    api.get("/consultas").then((res) => {
      setTotalConsultas(res.data.data ?? []);
    });
  }, []);
  // Citas Programadas
  const hoy = new Date();
  const fechaHoyString = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
  const citasHoy = totalConsultas.filter((consulta) => {
    return (
      consulta.fecha === fechaHoyString && consulta.estado === "PROGRAMADA"
    );
  });
  // Consultas completadas hoy
  const programadasHoy = totalConsultas.filter((consulta) => {
    return (
      consulta.fecha === fechaHoyString && consulta.estado === "PROGRAMADA"
    );
  });
  // Data de Metricas Clínicas
  const metricasClinica: Metrica[] = [
    {
      id: "paciente",
      titulo: "Pacientes",
      valor: totalPacientes,
      descripcion: "Total de pacientes registrados",
      tendencia: "positiva",
      icono: "👥",
    },
    {
      id: "cita",
      titulo: "Citas Hoy",
      valor: citasHoy.length,
      descripcion: "Citas programadas para hoy",
      tendencia: "neutra",
      icono: "📅",
    },
    {
      id: "consulta",
      titulo: "Consultas Pendientes",
      valor: programadasHoy.length,
      descripcion: "Por revisar en el sistema",
      tendencia: "negativa",
      icono: "⏳",
    },
    {
      id: "disponibilidad",
      titulo: "Disponibilidad",
      valor: "85%",
      descripcion: "Capacidad actual del centro",
      tendencia: "positiva",
      icono: "🏥",
    },
  ];

  // Formateando fecha del día para mostrar en dashboard
  const fechaFormateada = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const fechaHoy =
    fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Banner rojo superior si está activo el mantenimiento */}
      {enMantenimiento && (
        <div className="bg-rose-600 text-white text-center py-2 px-4 text-sm font-medium animate-pulse">
          ⚠️ El sistema se encuentra actualmente en Modo Mantenimiento.
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Encabezado del Dashboard */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Panel de Control
            </h1>
            <p className="text-slate-500 mt-1 whitespace-pre-line">
              {"MONITOREO DE LA CLÍNICA\n"}
              {fechaHoy}
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm border border-slate-200">
            <StatusBadge activo={!enMantenimiento} />
            <button
              onClick={() => setEnMantenimiento(!enMantenimiento)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                enMantenimiento
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  : "bg-amber-100 text-amber-700 hover:bg-amber-200"
              }`}
            >
              {enMantenimiento ? "Activar Sistema" : "Poner en Mantenimiento"}
            </button>
          </div>
        </header>

        {/* Panel de Control de Pacientes (Única métrica dinámica) */}
        <section className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm font-medium text-slate-600">
            Modificar contador rápido:{" "}
            <span className="font-bold text-slate-900">
              {totalPacientes} Pacientes
            </span>
          </div>
          {/* REQUISITO: Botones +/- para modificar el valor de Pacientes */}
          <div className="flex gap-2">
            <button
              onClick={() =>
                setTotalPacientes(totalPacientes === 0 ? 0 : totalPacientes - 1)
              }
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors border border-slate-300"
            >
              − Reducir
            </button>
            <button
              onClick={() => setTotalPacientes(totalPacientes + 1)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors shadow-sm"
            >
              ＋ Incrementar
            </button>
          </div>
        </section>

        {/* REQUISITO: Cuadrícula con las 4 métricas integradas */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricasClinica.map((m) => (
            <MetricCard metrica={m} />
          ))}
        </main>
      </div>
    </div>
  );
}
