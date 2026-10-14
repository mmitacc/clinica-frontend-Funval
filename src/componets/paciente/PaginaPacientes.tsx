import { useState } from "react";
import { BuscadorPacientes } from "./BuscadorPacientes";
import { PacienteCard } from "./PacienteCard";
import type { Paciente } from "../../types/paciente";
import dataPacientes from "../../data/pacientes.json"; // 5 pacientes de ejemplo

export const PaginaPacientes: React.FC = () => {
  // Estado local nativo compatible con React 19.2
  const [pacientes, setPacientes] = useState<Paciente[]>(
    dataPacientes as Paciente[],
  );
  const [busqueda, setBusqueda] = useState<string>("");

  const handleVerDetalles = (id: string) => {
    console.log("Ver ficha del paciente con ID:", id);
  };

  const handleEditar = (id: string) => {
    console.log("Editar paciente con ID:", id);
  };

  // Filtrado reactivo en tiempo real
  const pacientesFiltrados = pacientes.filter((paciente) => {
    const termino = busqueda.toLowerCase().trim();
    return (
      paciente.nombre.toLowerCase().includes(termino) ||
      paciente.apellido.toLowerCase().includes(termino) ||
      paciente.especialidadAsignada.toLowerCase().includes(termino) ||
      paciente.id.toLowerCase().includes(termino)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Cabecera de la Sección */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
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
                Gestión de Pacientes
              </h1>
              <p className="text-sm text-blue-800">
                Visualiza, busca y administra el historial de tus pacientes
                registrados.
              </p>
            </div>
          </div>

          {/* Botón Nuevo Paciente */}
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40 active:scale-[0.98]"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Nuevo Paciente
          </button>
        </header>

        {/* Barra de Herramientas (Buscador y Contador) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <BuscadorPacientes value={busqueda} onChange={setBusqueda} />

          <div className="text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 self-start sm:self-auto">
            Mostrando{" "}
            <span className="font-semibold text-slate-800">
              {pacientesFiltrados.length}
            </span>{" "}
            de{" "}
            <span className="font-semibold text-slate-800">
              {pacientes.length}
            </span>{" "}
            pacientes
          </div>
        </div>

        {/* Cuadrícula de Tarjetas */}
        {pacientesFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pacientesFiltrados.map((paciente) => (
              <PacienteCard
                key={paciente.id}
                paciente={paciente}
                onVerDetalles={handleVerDetalles}
                onEditar={handleEditar}
              />
            ))}
          </div>
        ) : (
          /* Estado de búsqueda sin resultados */
          <div className="flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center shadow-sm">
            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              No se encontraron pacientes
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              No hay registros que coincidan con tu búsqueda "{busqueda}".
              Intenta con otro término.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
