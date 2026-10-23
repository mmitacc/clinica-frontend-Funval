import { useEffect, useState, useMemo } from "react";
import { BuscadorPacientes } from "../componets/paciente/BuscadorPacientes";
import { PacienteCard } from "../componets/paciente/PacienteCard";
import type { EstadoPacienteFiltro } from "../stores/useFiltrosStore";
import type { EstadoPaciente } from "../types/paciente";
import { ModalNuevoPaciente } from "../componets/paciente/ModalNuevoPaciente";
import { toast } from "sonner";
import { extraerMensajeError } from "../lib/errorHandler";
import { usePacientesStore } from "../stores/pacientesStore";
import { useFiltrosStore } from "../stores/useFiltrosStore";
import { useApi } from "../hooks/useApi"; // <-- Importamos tu hook genérico
import useDebounce from "../hooks/useDebounce";
import type { Paciente } from "../types/paciente";

export default function PaginaPacientes() {
  // Datos de paciente inicial
  const dataInitPaciente = {
    nombres: "",
    apellidos: "",
    telefono: "",
    email: "",
    masculino: true,
    fechanacimiento: "",
    tiposangre: "" as any,
    alergias: "",
    estado: "ACTIVO" as any,
    especialidadAsignada: "General",
  };

  // - Variables de estado para Cargar data de pacientes mediante useApi
  // Notación: cambiamos 'busqueda' por tu estado local que controla el input actual
  const busqueda = useFiltrosStore((s) => s.queryPacientes);
  const estadoPacienteFiltro = useFiltrosStore((s) => s.estadoPacienteFiltro);
  const setEstadoPaciente = useFiltrosStore((s) => s.setEstadoPaciente);
  const setBusqueda = useFiltrosStore((s) => s.setQueryPacientes);

  // Acciones mutate de Zustand
  const crearPaciente = usePacientesStore((s) => s.crear);
  const actualizarPaciente = usePacientesStore((s) => s.actualizar);
  const eliminarPaciente = usePacientesStore((s) => s.eliminar);

  // - Variables de estado para crear un nuevo y update paciente
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [esEdicion, setEsEdicion] = useState<boolean>(false);
  const [idPacienteAEditar, setIdPacienteAEditar] = useState<
    string | number | null
  >(null);
  const [pacienteData, setPacienteData] = useState(dataInitPaciente);

  // Debounce para filtros combinados de busquedas
  const busquedaDebounce = useDebounce(busqueda, 350);

  // 1. Memorizamos los parámetros HTTP para que useApi no cree bucles infinitos
  const apiParams = useMemo(() => {
    return {
      query:
        busquedaDebounce.trim() !== "" ? busquedaDebounce.trim() : undefined,
    };
  }, [busquedaDebounce]);

  // 2. INTEGRACIÓN DE USEAPI: Consume el endpoint tipando estrictamente con <Paciente[]>
  // Devuelve la data limpia, el estado de carga y error, junto a la función 'recargar' para los mutates
  const {
    data: pacientes,
    cargando,
    error,
    recargar,
  } = useApi<Paciente[]>("/pacientes", apiParams);

  // Filtros para pacientes en Frontend basados en la respuesta de useApi
  const pacientesFiltrados = useMemo(() => {
    if (!pacientes) return [];
    return pacientes
      .filter(
        (p) =>
          (p.nombres
            .toLowerCase()
            .includes(busquedaDebounce.toLowerCase().trim()) ||
            p.apellidos
              .toLowerCase()
              .includes(busquedaDebounce.toLowerCase().trim())) &&
          (estadoPacienteFiltro === "todos" ||
            p.estado === estadoPacienteFiltro),
      )
      .sort((a, b) => a.nombres.localeCompare(b.nombres));
  }, [pacientes, busquedaDebounce, estadoPacienteFiltro]);

  // - Eventos de cambio de estado para los filtros
  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEstadoPaciente(e.target.value as EstadoPacienteFiltro);
  };

  // Renderizado condicional si ocurre un error en useApi
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center bg-blue-50 border border-blue-100 rounded-xl max-w-md mx-auto my-4">
        <div className="flex items-center justify-center w-12 h-12 mb-3 bg-blue-100 rounded-full text-blue-600 font-bold text-xl">
          !
        </div>
        <p className="text-base font-semibold text-blue-900 mb-4">
          {extraerMensajeError(error)}
        </p>
        <button
          onClick={recargar} // <-- Usamos recargar de useApi
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-lg shadow-sm shadow-blue-200 transition-colors duration-200"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Agregar / Modificar Paciente
  const handleGuardarPaciente = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(pacienteData.email.trim())) {
      toast.info(
        "Por favor, introduce un correo electrónico válido con su extensión (Ej: .com, .es).",
      );
      return;
    }

    const estructuraBase = {
      nombres: pacienteData.nombres.trim(),
      apellidos: pacienteData.apellidos.trim(),
      telefono: pacienteData.telefono.trim(),
      email: pacienteData.email.trim(),
      masculino: pacienteData.masculino,
      fechanacimiento: pacienteData.fechanacimiento
        ? new Date(pacienteData.fechanacimiento).toISOString().split("T")[0]
        : "",
      tiposangre: pacienteData.tiposangre,
      alergias: pacienteData.alergias.trim() || "Ninguna",
      estado: pacienteData.estado ?? "ACTIVO",
    };

    try {
      if (esEdicion && idPacienteAEditar !== null) {
        const payloadEdicion = {
          ...estructuraBase,
          estado: pacienteData.estado.toUpperCase(),
        };
        await actualizarPaciente(idPacienteAEditar, payloadEdicion);
        toast.success("¡Datos del paciente actualizados con éxito!");
      } else {
        await crearPaciente(estructuraBase);
        toast.success("¡Paciente registrado con éxito!");
      }

      setModalAbierto(false);
      limpiarFormulario();
      recargar(); // <-- Sincroniza la lista llamando de nuevo al fetch con AbortController limpio
    } catch (err) {
      toast.error("Ocurrió un error al procesar la solicitud en el servidor.");
    }
  };

  // Eliminar un Paciente
  const handleEliminar = (id: string | number, nombrePaciente?: string) => {
    toast("¿Seguro que deseas eliminar este paciente?", {
      description: nombrePaciente
        ? `Se eliminará a: ${nombrePaciente}`
        : undefined,
      duration: Infinity,
      position: "top-center",
      action: {
        label: "Eliminar",
        onClick: async () => {
          try {
            await eliminarPaciente(id);
            toast.success("Paciente eliminado correctamente.");
            recargar(); // <-- Refresca useApi
          } catch (err) {
            console.error("Error al eliminar:", err);
            toast.error("Ocurrió un error al intentar eliminar el paciente.");
          }
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => toast.dismiss(),
      },
    });
  };

  // Editar el estado de un Paciente
  const handleCambiarEstado = async (
    id: string | number,
    nuevoEstado: EstadoPaciente,
  ) => {
    try {
      await actualizarPaciente(id, { estado: nuevoEstado });
      toast.success("¡Estado del paciente actualizado!");
      recargar(); // <-- Refresca useApi de forma segura
    } catch (err) {
      toast.error("No se pudo cambiar el estado del paciente");
    }
  };

  // Limpiar formulario modal create/update
  const limpiarFormulario = () => {
    setEsEdicion(false);
    setIdPacienteAEditar(null);
    setPacienteData(dataInitPaciente);
  };

  // Editar un paciente seleccionado
  const handleEditar = (id: string | number) => {
    if (!pacientes) return; // Asegura que existan datos antes de buscar
    const pacienteSeleccionado = pacientes.find((p) => p.id === id);

    if (!pacienteSeleccionado) {
      toast.error("No se encontraron los datos del paciente seleccionado.");
      return;
    }

    setEsEdicion(true);
    setIdPacienteAEditar(pacienteSeleccionado.id);

    setPacienteData({
      nombres: pacienteSeleccionado.nombres,
      apellidos: pacienteSeleccionado.apellidos,
      telefono: pacienteSeleccionado.telefono,
      email: pacienteSeleccionado.email,
      masculino: pacienteSeleccionado.masculino,
      fechanacimiento: pacienteSeleccionado.fechanacimiento
        ? pacienteSeleccionado.fechanacimiento.split("T")[0]
        : "",
      tiposangre: pacienteSeleccionado.tiposangre,
      alergias: pacienteSeleccionado.alergias || "",
      estado: pacienteSeleccionado.estado.toUpperCase(),
      especialidadAsignada:
        pacienteSeleccionado.especialidadAsignada || "General",
    });
    setModalAbierto(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 px-6 py-4 md:py-6">
      <div className="max-w-7xl mx-auto space-y-5">
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
              value={estadoPacienteFiltro}
              onChange={handleEstadoChange}
            >
              <option value="todos">Estado: Todos</option>
              <option value="ACTIVO">Estado: Actico</option>
              <option value="INACTIVO">Estado: Inactivo</option>
              <option value="EN_ESPERA">Estado: Espera</option>
            </select>
          </div>
          <div className="text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 self-start sm:self-auto">
            <span className="font-semibold text-slate-800">
              {pacientesFiltrados.length}
            </span>{" "}
            Pacientes encontrados.
          </div>
        </div>
        {cargando ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] p-6 space-y-4">
            {/* Spinner animado en azul */}
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-blue-700 animate-pulse">
              La página está cargando...
            </p>
          </div>
        ) : pacientesFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pacientesFiltrados.map((paciente) => (
              <PacienteCard
                key={paciente.id}
                paciente={paciente}
                // onVerDetalles={handleVerDetalles}
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
      </div>

      {/* ********************************************************************* */}
      <ModalNuevoPaciente
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          limpiarFormulario();
        }}
        onSubmit={handleGuardarPaciente}
        pacienteData={pacienteData}
        setPacienteData={setPacienteData}
        esEdicion={esEdicion}
      />
      {/* ********************************************************************* */}
    </div>
  );
}
