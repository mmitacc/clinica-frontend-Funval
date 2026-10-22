import { useEffect, useState } from "react";
import { BuscadorPacientes } from "../componets/paciente/BuscadorPacientes";
import { PacienteCard } from "../componets/paciente/PacienteCard";
import type {
  EstadoPaciente,
  NuevoPacienteForm,
  Paciente,
} from "../types/paciente";
import { ModalNuevoPaciente } from "../componets/paciente/ModalNuevoPaciente";
import { pacientesService } from "../services/pacientes";
import { toast } from "sonner";
import { extraerMensajeError } from "../lib/errorHandler";

export default function PaginaPacientes() {
  // - Variables de estado para Cargar data de pacientes
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  // - Variables de estado para los filtros combinados
  const [busqueda, setBusqueda] = useState<string>("");
  const [estado, setEstado] = useState<string>("todos");
  // - Variables de estado para crea un nuevo y update paciente
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [esEdicion, setEsEdicion] = useState<boolean>(false);
  const [idPacienteAEditar, setIdPacienteAEditar] = useState<
    string | number | null
  >(null);
  const [pacienteData, setPacienteData] = useState({
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
  });

  // Cargar data utilizando el servicio centralizado
  const cargarPacientes = async () => {
    setCargando(true);
    setError(false);
    try {
      const data = await pacientesService.getAll();
      setPacientes(data); // El servicio ya te entrega el array de pacientes mapeado y limpio
    } catch (err) {
      setError(true);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  const reintentarCargarPacientes = () => {
    cargarPacientes();
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-6 space-y-4">
        {/* Spinner animado en azul */}
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-blue-700 animate-pulse">
          La página está cargando...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center bg-blue-50 border border-blue-100 rounded-xl max-w-md mx-auto my-4">
        {/* Icono de advertencia simple usando bordes */}
        <div className="flex items-center justify-center w-12 h-12 mb-3 bg-blue-100 rounded-full text-blue-600 font-bold text-xl">
          !
        </div>
        <p className="text-base font-semibold text-blue-900 mb-4">
          No se pudieron cargar los datos.
        </p>
        <button
          onClick={reintentarCargarPacientes}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-lg shadow-sm shadow-blue-200 transition-colors duration-200"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Filtros para pacientes
  // - Lógica para los filtros combinados
  const pacientesFiltrados = pacientes
    .filter(
      (p) =>
        (p.nombres.toLowerCase().includes(busqueda.toLowerCase().trim()) ||
          p.apellidos.toLowerCase().includes(busqueda.toLowerCase().trim())) &&
        (estado === "todos" || p.estado === estado),
    )
    .sort((a, b) => a.nombres.localeCompare(b.nombres));
  // - Eventos de cambio de estado para los filtros
  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setEstado(e.target.value);

  // Agregar un nuevo paciente con una ventana emergente
  const handleGuardarPaciente = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Tus Validaciones Robustas para el email (Se mantienen intactas)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(pacienteData.email.trim())) {
      toast.info(
        "Por favor, introduce un correo electrónico válido con su extensión (Ej: .com, .es).",
      );
      return;
    }

    // 2. Construir la estructura final (Mapeamos dinámicamente el estado si es edición)
    const pacienteFinal: any = {
      nombres: pacienteData.nombres.trim(),
      apellidos: pacienteData.apellidos.trim(),
      telefono: pacienteData.telefono.trim(),
      email: pacienteData.email.trim(),
      masculino: pacienteData.masculino,
      // Conservamos tu formato de fecha de origen
      fechanacimiento: pacienteData.fechanacimiento
        ? new Date(pacienteData.fechanacimiento).toISOString()
        : "",
      tiposangre: pacienteData.tiposangre,
      alergias: pacienteData.alergias.trim() || "Ninguna",
      // Si es edición, mandamos el estado seleccionado en el modal; si es nuevo, por defecto va "ACTIVO"
      estado: esEdicion ? pacienteData.estado.toUpperCase() : "ACTIVO",
    };

    // 3. Envío asíncrono adaptado para Crear o Editar
    const guardarOActualizar = async (datosFinales: any) => {
      try {
        if (esEdicion && idPacienteAEditar !== null) {
          // --- CASO EDICIÓN ---
          const pacienteActualizado = await pacientesService.update(
            idPacienteAEditar,
            datosFinales,
          );

          // Actualizamos localmente el paciente modificado en la lista
          setPacientes((prev) =>
            prev.map((p) =>
              p.id === idPacienteAEditar ? pacienteActualizado : p,
            ),
          );
          toast.success("¡Datos del paciente actualizados con éxito!");
        } else {
          // --- CASO CREACIÓN (Tu flujo original) ---
          await pacientesService.create(datosFinales);
          await cargarPacientes();
          toast.success("¡Paciente registrado con éxito!");
        }

        // Al finalizar con éxito cualquiera de las dos acciones, cerramos y limpiamos
        setModalAbierto(false);
        setEsEdicion(false);
        setIdPacienteAEditar(null);
        setPacienteData({
          nombres: "",
          apellidos: "",
          telefono: "",
          email: "",
          masculino: true,
          fechanacimiento: "",
          tiposangre: "" as any,
          alergias: "",
          estado: "ACTIVO", // Agregado para limpiar el campo de estado
          especialidadAsignada: "General",
        });
      } catch (err) {
        const errorReal = extraerMensajeError(err);
        toast.error(errorReal);
      }
    };

    // Ejecutamos la sub-función pasándole el objeto unificado
    guardarOActualizar(pacienteFinal);
  };

  // --------------------

  // Eliminar un Paciente
  const handleEliminar = (id: string | number, nombrePaciente?: string) => {
    // 1. Desparamos un toast de tipo "aviso/info" que pide confirmación
    toast("¿Seguro que deseas eliminar este paciente?", {
      description: nombrePaciente
        ? `Se eliminará a: ${nombrePaciente}`
        : undefined,
      duration: Infinity, // Hace que el toast no se cierre solo hasta que elijan una opción
      position: "top-center", // Lo centramos arriba para que tenga buena visibilidad
      action: {
        label: "Eliminar",
        onClick: async () => {
          // 2. Si el usuario hace clic en "Eliminar", se ejecuta la lógica asíncrona
          try {
            await pacientesService.delete(id);

            // Actualizamos el estado local en el frontend
            setPacientes((prev) => prev.filter((p) => p.id !== id));

            // Notificación final de éxito
            toast.success("Paciente eliminado correctamente.");
          } catch (err) {
            const mensajeError = extraerMensajeError(err);
            console.error("Error al eliminar:", err);
            toast.error(`Error: ${mensajeError}`);
          }
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => {
          // Opcional: puedes disparar algo al cancelar o dejarlo vacío para que solo se cierre
          toast.dismiss();
        },
      },
    });
  };
  // --------------------

  // Editar el estado de un Paciente
  const handleCambiarEstado = (
    id: string | number,
    nuevoEstado: EstadoPaciente,
  ) => {
    setPacientes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p)),
    );
  };
  // --------------------

  // Mostrar o visualizar en el futuro la ficha del paciente
  const handleVerDetalles = (id: string | number) => {
    console.log("Ver ficha del paciente con ID:", id);
  };
  // --------------------

  // Editar un paciente seleccionado
  const handleEditar = (id: string | number) => {
    // 1. Buscamos al paciente seleccionado dentro de la lista actual del estado
    const pacienteSeleccionado = pacientes.find((p) => p.id === id);

    if (!pacienteSeleccionado) {
      toast.error("No se encontraron los datos del paciente seleccionado.");
      return;
    }

    // 2. Activamos la bandera de edición y guardamos el ID para usarlo luego en el PUT
    setEsEdicion(true);
    setIdPacienteAEditar(id);

    // 3. Rellenamos el estado del formulario con los datos reales del paciente.
    // Nota: Si la fecha viene como ISO completo (ej: "1985-05-21T00:00:00.000Z"),
    // usamos .split('T')[0] para extraer solo "1985-05-21", que es lo que el <input type="date" /> necesita para renderizarse.
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
      estado: pacienteSeleccionado.estado,
      especialidadAsignada:
        pacienteSeleccionado.especialidadAsignada || "General",
    });

    // 4. Abrimos la ventana modal (que ahora mostrará el título "Modificar Datos del Paciente")
    setModalAbierto(true);
  };

  // --------------------

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
              value={estado}
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

        {/* Cuadrícula de Tarjetas */}
        {pacientesFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pacientesFiltrados.map((paciente) => (
              <PacienteCard
                key={paciente.id.toString()}
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
          pacienteData={pacienteData}
          setPacienteData={setPacienteData}
          esEdicion={esEdicion}
        />
        {/* ********************************************************************* */}
      </div>
    </div>
  );
}
