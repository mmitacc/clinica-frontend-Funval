import { useEffect, useState } from "react";
import { MetricCard } from "../componets/metrica/MetricCard";
import { StatusBadge } from "../componets/metrica/StatusBadge";
import type { Metrica } from "../types";
import type { Consulta } from "../types/consulta";
import { api } from "../lib/axios";

export default function PaginaDashboard() {
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
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500 rounded-2xl text-white shadow-md shadow-black-300 flex items-center justify-center">
              {/* Icono nativo de usuarios */}
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
            <div>
              <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
                Panel de Control
              </h1>
              <p className="text-sm text-blue-800 whitespace-pre-line">
                {"MONITOREO DE LA CLÍNICA\n"}
                {fechaHoy}
              </p>
            </div>
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

        {/* REQUISITO: Cuadrícula con las 4 métricas integradas */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricasClinica.map((m, index) => (
            <MetricCard key={index} metrica={m} />
          ))}
        </main>
      </div>
    </div>
  );
}
