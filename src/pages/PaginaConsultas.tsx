import { useEffect, useState, useMemo } from "react";
import { useCitasStore } from "../stores/useCitasStore";
import type { Consulta } from "../types/consulta";
import type { RespuestaPaginado } from "../types/api";
import EncabezadoPagina from "../componets/EncabezadoPagina";

export default function PaginaConsultas() {
  // 1. Consumo de estados y acciones de Zustand
  const storeCitas = useCitasStore((state) => state.citas);
  const cargando = useCitasStore((state) => state.cargando);
  const error = useCitasStore((state) => state.error);
  const cargarTodas = useCitasStore((state) => state.cargarTodas);

  // Estados para la paginación y filtros
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [filtroEstado, setFiltroEstado] = useState<string>("TODOS");
  const limitePorPagina = 5;

  const citas = useMemo(() => {
    if (!storeCitas) return [];
    if (Array.isArray(storeCitas)) return storeCitas;
    if (
      typeof storeCitas === "object" &&
      "data" in storeCitas &&
      Array.isArray((storeCitas as any).data)
    ) {
      return (storeCitas as any).data;
    }
    return [];
  }, [storeCitas]);

  // 2. Disparar la carga de la API al montar el componente
  useEffect(() => {
    cargarTodas();
  }, [cargarTodas]);

  // 3. Resetear a la página 1 cuando el filtro cambie
  useEffect(() => {
    setPaginaActual(1);
  }, [filtroEstado]);

  // 4. Filtrado de datos (Ahora blindado ya que 'citas' es garantizadamente un Array)
  const datosFiltrados = useMemo(() => {
    if (filtroEstado === "TODOS") return citas;
    return citas.filter((cita: Consulta) => cita.estado === filtroEstado);
  }, [filtroEstado, citas]);

  // 5. Aplicación de la lógica de corte para paginación frontend
  const paginacion: RespuestaPaginado<Consulta> = useMemo(() => {
    const total = datosFiltrados.length;
    const totalPaginas = Math.ceil(total / limitePorPagina) || 1;

    const paginaAjustada =
      paginaActual > totalPaginas ? totalPaginas : paginaActual;

    const inicio = (paginaAjustada - 1) * limitePorPagina;
    const fin = inicio + limitePorPagina;

    // Al garantizar arriba que datosFiltrados siempre sea un Array, el .slice jamás volverá a fallar 🎉
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
    <div className="p-6 max-w-7xl mx-auto">
      {/* ENCABEZADO GLOBAL REUTILIZABLE */}
      <EncabezadoPagina
        titulo="Historial de Consultas Médicas"
        descripcion="Gestión, seguimiento y control de citas del centro médico"
      >
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none cursor-pointer transition-colors hover:border-slate-300 w-full sm:w-auto"
        >
          <option value="TODOS">Todos los estados</option>
          <option value="PROGRAMADA">Programadas</option>
          <option value="COMPLETADA">Completadas</option>
          <option value="CANCELADA">Canceladas</option>
        </select>
      </EncabezadoPagina>

      {/* Manejo del Estado Global: Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium shadow-sm animate-fade-in">
          ⚠️ Ocurrió un error al cargar las consultas: {error}
        </div>
      )}

      {/* Tabla / Listado Principal */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden relative">
        {/* Lógica unificada para Loading, Vacío y Datos */}
        {cargando ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Paciente</th>
                  <th className="p-4">Fecha Cita</th>
                  <th className="p-4">Estado Clínico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Generamos 5 filas de esqueleto ficticias animadas */}
                {Array.from({ length: limitePorPagina }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-36"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !paginacion?.data || paginacion.data.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium">
            No se encontraron consultas registradas en este estado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Paciente</th>
                  <th className="p-4">Fecha Cita</th>
                  <th className="p-4">Estado Clínico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                {paginacion.data.map((cita) => (
                  <tr
                    key={cita.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-4 font-semibold text-blue-600">
                      #{cita.id}
                    </td>
                    <td className="p-4 font-medium text-slate-800">
                      Paciente {cita.id_paciente || "N/A"}
                    </td>
                    <td className="p-4 text-slate-500">
                      {cita.registerdate
                        ? new Date(cita.registerdate).toLocaleDateString()
                        : "Sin fecha registrada"}
                    </td>
                    <td className="p-4">
                      <span className={obtenerBadgeEstado(cita.estado)}>
                        {cita.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación de Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-4 flex items-center justify-between sm:px-6">
          <div className="text-sm text-gray-600 font-medium">
            Mostrando{" "}
            <span className="font-semibold text-slate-800">
              {cargando ? "..." : paginacion?.data?.length || 0}
            </span>{" "}
            de{" "}
            <span className="font-semibold text-slate-800">
              {cargando ? "..." : paginacion?.total || 0}
            </span>{" "}
            resultados clínicos
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1 || cargando}
              className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Anterior
            </button>
            <button
              onClick={() =>
                setPaginaActual((prev) =>
                  Math.min(prev + 1, paginacion?.totalPaginas || 1),
                )
              }
              disabled={paginaActual === paginacion?.totalPaginas || cargando}
              className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
