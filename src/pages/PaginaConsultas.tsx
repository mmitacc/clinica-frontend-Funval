import { useEffect, useState, useMemo } from "react";
import { useCitasStore } from "../stores/useCitasStore";
import type { Consulta } from "../types/consulta";
import type { RespuestaPaginado } from "../types/api";

export default function PaginaConsultas() {
  // 1. Consumo de estados y acciones de Zustand
  const citas = useCitasStore((state) => state.citas);
  const cargando = useCitasStore((state) => state.cargando);
  const error = useCitasStore((state) => state.error);
  const cargarTodas = useCitasStore((state) => state.cargarTodas);

  // Estados para la paginación y filtros
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [filtroEstado, setFiltroEstado] = useState<string>("TODOS");
  const limitePorPagina = 5;

  // 2. Disparar la carga de la API al montar el componente
  useEffect(() => {
    cargarTodas();
  }, [cargarTodas]);

  // 3. Resetear a la página 1 cuando el filtro cambie
  useEffect(() => {
    setPaginaActual(1);
  }, [filtroEstado]);

  // 4. Filtrado de datos (Ahora usa 'citas' de Zustand en lugar de MOCK_DATA)
  const datosFiltrados = useMemo(() => {
    if (filtroEstado === "TODOS") return citas;
    return citas.filter((cita) => cita.estado === filtroEstado);
  }, [filtroEstado, citas]);

  // 5. Aplicación de la lógica de corte para paginación frontend
  const paginacion: RespuestaPaginado<Consulta> = useMemo(() => {
    const total = datosFiltrados.length;
    const totalPaginas = Math.ceil(total / limitePorPagina) || 1;

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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Controles superiores (Filtros) */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Historial de Consultas
        </h1>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="TODOS">Todos los estados</option>
          <option value="PROGRAMADA">Programadas</option>
          <option value="COMPLETADA">Completadas</option>
          <option value="CANCELADA">Canceladas</option>
        </select>
      </div>

      {/* Manejo del Estado Global: Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          ⚠️ Ocurrió un error al cargar las consultas: {error}
        </div>
      )}

      {/* Tabla / Listado Principal */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden relative">
        {/* Esqueleto de Carga traslúcido */}
        {cargando && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 backdrop-blur-[1px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {paginacion.data.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No se encontraron consultas registradas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Paciente</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                {paginacion.data.map((cita) => (
                  <tr
                    key={cita.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-900">
                      #{cita.id}
                    </td>
                    <td className="p-4">
                      Paciente {cita.id_paciente || "N/A"}
                    </td>
                    <td className="p-4">
                      {new Date(cita.registerdate || "").toLocaleDateString()}
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
          <div className="text-sm text-gray-600">
            Mostrando{" "}
            <span className="font-medium">{paginacion.data.length}</span> de{" "}
            <span className="font-medium">{paginacion.total}</span> resultados
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1 || cargando}
              className="px-4 py-2 border rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-opacity"
            >
              Anterior
            </button>
            <button
              onClick={() =>
                setPaginaActual((prev) =>
                  Math.min(prev + 1, paginacion.totalPaginas),
                )
              }
              disabled={paginaActual === paginacion.totalPaginas || cargando}
              className="px-4 py-2 border rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-opacity"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
