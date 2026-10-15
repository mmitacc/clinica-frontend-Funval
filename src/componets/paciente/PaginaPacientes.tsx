import { useState } from "react";
import { BuscadorPacientes } from "./BuscadorPacientes";
import { PacienteCard } from "./PacienteCard";
import type { Paciente } from "../../types/paciente";
import dataPacientes from "../../data/pacientes.json"; // 5 pacientes de ejemplo
import { ModalNuevoPaciente } from "./ModalNuevoPaciente";

export const PaginaPacientes: React.FC = () => {
  // Estado local nativo compatible con React 19.2
  const [pacientes, setPacientes] = useState<Paciente[]>(
    dataPacientes as Paciente[],
  );

  // Filtros para pacientes
  // - Variables de estado para los filtros combinados
  const [busqueda, setBusqueda] = useState<string>("");
  const [estado, setEstado] = useState<string>("todos");
  // - Lógica para los filtros combinados
  const pacientesFiltrados = pacientes
    .filter(
      (p) =>
        (p.nombre.toLowerCase().includes(busqueda.toLowerCase().trim()) ||
          p.apellido.toLowerCase().includes(busqueda.toLowerCase().trim())) &&
        (estado === "todos" || p.estado === estado),
    )
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
  // - Eventos de cambio de estado para los filtros
  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setEstado(e.target.value);

  // Agregar un nuevo paciente con una ventana emergente
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [nuevoPaciente, setNuevoPaciente] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    especialidadAsignada: "General",
  });

  const handleGuardarPaciente = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Expresión regular robusta para Email (Obliga a tener texto + @ + texto + . + mínimo 2 letras)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(nuevoPaciente.email.trim())) {
      alert(
        "Por favor, introduce un correo electrónico válido con su extensión (Ej: .com, .es).",
      );
      return;
    }
    // Expresión regular corregida para Teléfono
    const telefonoRegex = /^\+?[0-9\s]{9,15}$/;
    if (!telefonoRegex.test(nuevoPaciente.telefono.trim())) {
      alert(
        "El formato del teléfono no es válido. Debe tener entre 9 y 15 dígitos.",
      );
      return;
    }
    // Generar un ID correlativo automático (ej: "pac-006")
    const numerosId = pacientes.map((p) =>
      parseInt(p.id.replace("pac-", ""), 10),
    );
    const siguienteNumero = Math.max(...numerosId, 0) + 1;
    const nuevoId = `pac-${String(siguienteNumero).padStart(3, "0")}`;

    const pacienteFinal: Paciente = {
      id: nuevoId,
      nombre: nuevoPaciente.nombre,
      apellido: nuevoPaciente.apellido,
      email: nuevoPaciente.email,
      telefono: nuevoPaciente.telefono,
      especialidadAsignada: nuevoPaciente.especialidadAsignada,
      ultimaCita: new Date().toISOString().split("T")[0], // Fecha de hoy (2026-10-14)
      estado: "activo",
    };

    setPacientes((prev) => [...prev, pacienteFinal]);
    setModalAbierto(false); // Cerrar ventana
    setNuevoPaciente({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      especialidadAsignada: "General",
    }); // Resetear
  };
  // --------------------

  // Eliminar un Paciente
  const handleEliminar = (id: string) => {
    if (window.confirm("¿Seguro que deseas eliminar este paciente?")) {
      setPacientes((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Editar el estado de un Paciente
  const handleCambiarEstado = (id: string, nuevoEstado: Paciente["estado"]) => {
    setPacientes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p)),
    );
  };

  // Mostrar o visualizar en el futuro la ficha del paciente
  const handleVerDetalles = (id: string) => {
    console.log("Ver ficha del paciente con ID:", id);
  };

  // Editar un paciente seleccionado
  const handleEditar = (id: string) => {
    console.log("Editar paciente con ID:", id);
  };

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
            onClick={() => setModalAbierto(true)}
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
          <div className="relative max-w-md">
            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={estado}
              onChange={handleEstadoChange}
            >
              <option value="todos">Estado: Todos</option>
              <option value="activo">Estado: Activo</option>
              <option value="inactivo">Estado: Inactivo</option>
              <option value="en_espera">Estado: En espera</option>
            </select>
          </div>
          <div className="text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 self-start sm:self-auto">
            <span className="font-semibold text-slate-800">
              {pacientesFiltrados.length}
            </span>{" "}
            Pacientes encontrados, del total de{" "}
            <span className="font-semibold text-slate-800">
              {pacientes.length}
            </span>
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
                onEliminar={handleEliminar}
                onCambiarEstado={handleCambiarEstado}
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
        {/* ********************************************************************* */}
        <ModalNuevoPaciente
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
          onSubmit={handleGuardarPaciente}
          nuevoPaciente={nuevoPaciente}
          setNuevoPaciente={setNuevoPaciente}
        />
        {/* ********************************************************************* */}
      </div>
    </div>
  );
};
