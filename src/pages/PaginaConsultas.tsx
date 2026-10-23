import React, { useState, useMemo } from "react";
import type { RespuestaPaginado } from "../types/api";
import type { Consulta } from "../types/Consulta";

// Datos de prueba basados en tu endpoint
const MOCK_DATA: Consulta[] = [
  {
    id: 1,
    id_paciente: 1,
    id_usuario: 4,
    estado: "COMPLETADA",
    costo: "50",
    registerdate: "2026-10-23T00:39:15Z",
    fecha: "2026-02-15",
    horario: "05:30",
  },
  {
    id: 2,
    id_paciente: 2,
    id_usuario: 5,
    estado: "COMPLETADA",
    costo: "60",
    registerdate: "2026-10-23T01:00:00Z",
    fecha: "2026-02-16",
    horario: "09:00",
  },
  {
    id: 3,
    id_paciente: 3,
    id_usuario: 4,
    estado: "PROGRAMADA",
    costo: "50",
    registerdate: "2026-10-23T02:15:00Z",
    fecha: "2026-02-17",
    horario: "10:30",
  },
  {
    id: 4,
    id_paciente: 4,
    id_usuario: 5,
    estado: "COMPLETADA",
    costo: "50",
    registerdate: "2026-10-23T03:00:00Z",
    fecha: "2026-02-18",
    horario: "14:15",
  },
  {
    id: 5,
    id_paciente: 5,
    id_usuario: 4,
    estado: "CANCELADA",
    costo: "40",
    registerdate: "2026-10-23T04:20:00Z",
    fecha: "2026-02-19",
    horario: "16:00",
  },
  {
    id: 6,
    id_paciente: 6,
    id_usuario: 5,
    estado: "COMPLETADA",
    costo: "70",
    registerdate: "2026-10-23T05:10:00Z",
    fecha: "2026-02-20",
    horario: "11:00",
  },
  {
    id: 7,
    id_paciente: 1,
    id_usuario: 5,
    estado: "PROGRAMADA",
    costo: "50",
    registerdate: "2026-10-23T06:00:00Z",
    fecha: "2026-02-21",
    horario: "08:30",
  },
];

export function PaginaConsultas() {
  // Estados para la paginación y filtros
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [filtroEstado, setFiltroEstado] = useState<string>("TODOS");
  const limitePorPagina = 5;

  // 1. Filtrado de datos (Opcional, pero añade robustez)
  const datosFiltrados = useMemo(() => {
    if (filtroEstado === "TODOS") return MOCK_DATA;
    return MOCK_DATA.filter((cita) => cita.estado === filtroEstado);
  }, [filtroEstado]);

  // 2. Aplicación de la lógica de corte para paginación frontend
  const paginacion: RespuestaPaginado<Consulta> = useMemo(() => {
    const total = datosFiltrados.length;
    const totalPaginas = Math.ceil(total / limitePorPagina) || 1;

    // Ajustar página actual si los filtros reducen el set de datos
    const paginaAjustada =
      paginaActual > totalPaginas ? totalPaginas : paginaActual;

    const inicio = (paginaAjustada - 1) * limitePorPagina;
    const fin = inicio + limitePorPagina;
    const data = datosFiltrados.slice(inicio, fin);

    return {
      data,
      total,
      pagina: paginaAjustada,
      porPagina: limitePorPagina,
      totalPaginas,
    };
  }, [datosFiltrados, paginaActual]);

  // Helper estético para las etiquetas de estado
  const obtenerBadgeEstado = (estado: string) => {
    const estilos: Record<string, string> = {
      COMPLETADA: "bg-green-100 text-green-800 border-green-200",
      PENDIENTE: "bg-yellow-100 text-yellow-800 border-yellow-200",
      CANCELADA: "bg-red-100 text-red-800 border-red-200",
    };
    return `px-2.5 py-1 text-xs font-semibold rounded-full border ${estilos[estado] || "bg-gray-100"}`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800 font-sans">
      {/* Cabecera de la Página */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Historial Clínico de Consultas
          </h1>
          <p className="text-sm text-gray-500">
            Gestione y revise las citas médicas programadas del sistema.
          </p>
        </div>

        {/* Filtros Rápidos */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Filtrar por:
          </label>
          <select
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              setPaginaActual(1);
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="COMPLETADA">Completadas</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="CANCELADA">Canceladas</option>
          </select>
        </div>
      </div>

      {/* Contenedor Principal de la Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="p-4">ID Cita</th>
                <th className="p-4">Paciente</th>
                <th className="p-4">Médico / Usuario</th>
                <th className="p-4">Fecha de Cita</th>
                <th className="p-4">Horario</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Costo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {paginacion.data.length > 0 ? (
                paginacion.data.map((cita: Consulta) => (
                  <tr
                    key={cita.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="p-4 font-mono text-xs text-gray-400">
                      #00{cita.id}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">
                        Paciente {cita.id_paciente}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      Dr. ID {cita.id_usuario}
                    </td>
                    <td className="p-4 font-medium text-gray-700">
                      {cita.fecha}
                    </td>
                    <td className="p-4 text-gray-500">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-mono">
                        {cita.horario} hrs
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={obtenerBadgeEstado(cita.estado)}>
                        {cita.estado}
                      </span>
                    </td>
                    <td className="p-4 text-right font-semibold text-gray-900">
                      ${parseFloat(cita.costo).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-gray-400">
                    No se encontraron consultas con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Sección de Paginación UI */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginacion.pagina === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() =>
                setPaginaActual((prev) =>
                  Math.min(prev + 1, paginacion.totalPaginas),
                )
              }
              disabled={paginacion.pagina === paginacion.totalPaginas}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando página{" "}
                <span className="font-semibold">{paginacion.pagina}</span> de{" "}
                <span className="font-semibold">{paginacion.totalPaginas}</span>{" "}
                (<span className="font-semibold">{paginacion.total}</span>{" "}
                registros totales)
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() =>
                    setPaginaActual((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={paginacion.pagina === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Anterior</span>
                  &larr;
                </button>

                {[...Array(paginacion.totalPaginas)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setPaginaActual(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      paginacion.pagina === index + 1
                        ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setPaginaActual((prev) =>
                      Math.min(prev + 1, paginacion.totalPaginas),
                    )
                  }
                  disabled={paginacion.pagina === paginacion.totalPaginas}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Siguiente</span>
                  &rarr;
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
