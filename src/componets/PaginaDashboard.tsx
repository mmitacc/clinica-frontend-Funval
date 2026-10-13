import { useState } from "react";
import { MetricCard } from "./MetricCard"; // El componente que corregimos antes
import { StatusBadge } from "./StatusBadge"; // El componente del toggle
import type { Metrica } from "../types";

export function PaginaDashboard() {
  // Estado global del sistema, para interactuar con StatusBadge
  const [enMantenimiento, setEnMantenimiento] = useState<boolean>(false);

  // Estado para los pacientes registrados para el día de hoy
  const [pacientes, setPacientes] = useState<number>(10); // Número inicial de pacientes

  // Definimos el conjunto de 4 objetos con metricas del día
  const metricaPacientes: Metrica = {
    id: "paciente",
    titulo: "Pacientes",
    valor: String(pacientes),
    descripcion: "Total de pacientes registrados",
    tendencia: "positiva",
    icono: "👥",
  };

  const metricaCitas: Metrica = {
    id: "cita",
    titulo: "Citas Hoy",
    valor: "12",
    descripcion: "Citas programadas para hoy",
    tendencia: "neutra",
    icono: "📅",
  };

  const metricaConsultas: Metrica = {
    id: "consulta",
    titulo: "Consultas Pendientes",
    valor: "5",
    descripcion: "Por revisar en el sistema",
    tendencia: "negativa",
    icono: "⏳",
  };

  const metricaDisponibilidad: Metrica = {
    id: "disponibiliadad",
    titulo: "Disponibilidad",
    valor: "85%",
    descripcion: "Capacidad actual del centro",
    tendencia: "positiva",
    icono: "🏥",
  };

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
              {"MONITOREO DE LA CLÍNICA\n"}{fechaHoy}
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
              {pacientes} Pacientes
            </span>
          </div>
          {/* REQUISITO: Botones +/- para modificar el valor de Pacientes */}
          <div className="flex gap-2">
            <button
              onClick={() => setPacientes(pacientes === 0 ? 0 : pacientes - 1)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors border border-slate-300"
            >
              − Reducir
            </button>
            <button
              onClick={() => setPacientes(pacientes + 1)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors shadow-sm"
            >
              ＋ Incrementar
            </button>
          </div>
        </section>

        {/* REQUISITO: Cuadrícula con las 4 métricas integradas */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard metrica={metricaPacientes} />
          <MetricCard metrica={metricaCitas} />
          <MetricCard metrica={metricaConsultas} />
          <MetricCard metrica={metricaDisponibilidad} />
        </main>
      </div>
    </div>
  );
}
