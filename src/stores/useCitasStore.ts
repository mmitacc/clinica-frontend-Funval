import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { extraerMensajeError } from "../lib/errorHandler";
import { api } from "../lib/axios";
import type { Consulta, EstadoConsulta } from "../types/consulta";

// Interfaz del Estado y las Acciones del Store
interface CitasState {
  citas: Consulta[];
  citaSeleccionada: Consulta | null;
  cargando: boolean;
  error: string | null;
  cargarTodas: () => Promise<void>;
  cargarPorPaciente: (idPaciente: number) => Promise<void>;
  seleccionar: (id: number) => void;
  actualizarEstado: (id: number, estado: EstadoConsulta) => Promise<void>;
  agregarCita: (cita: Omit<Consulta, "id" | "registerdate">) => Promise<void>;
  actualizarCita: (
    id: number,
    datosActualizados: Partial<Omit<Consulta, "id" | "registerdate">>,
  ) => Promise<void>;
  eliminarCita: (id: number) => Promise<void>;
  limpiarSeleccion: () => void;
  resetStore: () => void;
}

// Creación del Store con Zustand y Devtools con retraso
export const useCitasStore = create<CitasState>()(
  devtools(
    (set, get) => ({
      citas: [],
      citaSeleccionada: null,
      cargando: false,
      error: null,

      // Carga todas las citas globales desde la API
      cargarTodas: async () => {
        set({ cargando: true, error: null });
        try {
          // 1. Hacemos la petición real al backend
          const respuesta = await api.get("/consultas");

          // 2. CREAMOS EL RETRASO ARTIFICIAL (Ej. 2500 milisegundos = 2.5 segundos)
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // 3. Una vez pasa el tiempo, guardamos los datos y apagamos el Skeleton
          set({ citas: respuesta.data, cargando: false });
        } catch (err) {
          set({ error: extraerMensajeError(err), cargando: false });
        }
      },

      // Carga las citas de un paciente específico desde la API
      cargarPorPaciente: async (idPaciente) => {
        set({ cargando: true, error: null });
        try {
          const res = await api.get(`/consultas/paciente/${idPaciente}`);
          set({ citas: res.data.data || res.data, cargando: false });
        } catch (err) {
          set({ error: extraerMensajeError(err), cargando: false });
        }
      },

      // Busca la cita en memoria local para evitar peticiones HTTP extras
      seleccionar: (id) => {
        const { citas } = get();
        const cita = citas.find((c) => c.id === id) || null;
        set({ citaSeleccionada: cita });
      },

      // Actualiza el estado de la cita en el servidor y sincroniza el estado local
      actualizarEstado: async (id, estado) => {
        set({ cargando: true, error: null });
        try {
          await api.patch(`/consultas/medico/${id}`, { estado });

          const citasActualizadas = get().citas.map((c) =>
            c.id === id ? { ...c, estado } : c,
          );

          const citaSeleccionadaActual = get().citaSeleccionada;
          const nuevaCitaSeleccionada =
            citaSeleccionadaActual?.id === id
              ? { ...citaSeleccionadaActual, estado }
              : citaSeleccionadaActual;

          set({
            citas: citasActualizadas,
            citaSeleccionada: nuevaCitaSeleccionada,
            cargando: false,
          });
        } catch (err) {
          set({ error: extraerMensajeError(err), cargando: false });
        }
      },

      // Crea una nueva cita en el backend y la añade al listado local
      agregarCita: async (nuevaCita) => {
        set({ cargando: true, error: null });
        console.log("nuevaCita => ", nuevaCita);
        const { estado, ...newCita } = nuevaCita;
        try {
          const res = await api.post("/consultas", newCita);
          const citaCreada = res.data.data || res.data;
          set((state) => ({
            citas: [...state.citas, citaCreada],
            cargando: false,
          }));
        } catch (err) {
          set({ error: extraerMensajeError(err), cargando: false });
        }
      },

      // [NUEVO] Actualiza campos generales de una cita (ej. fecha, motivo, médico)
      actualizarCita: async (id, datosActualizados) => {
        set({ cargando: true, error: null });
        try {
          // Asumiendo ruta REST clásica /consultas/:id para actualizaciones generales (PUT o PATCH)
          const res = await api.put(`/consultas/${id}`, datosActualizados);
          const citaEditada = res.data.data || res.data;

          const citasActualizadas = get().citas.map((c) =>
            c.id === id ? { ...c, ...citaEditada } : c,
          );

          const citaSeleccionadaActual = get().citaSeleccionada;
          const nuevaCitaSeleccionada =
            citaSeleccionadaActual?.id === id
              ? { ...citaSeleccionadaActual, ...citaEditada }
              : citaSeleccionadaActual;

          set({
            citas: citasActualizadas,
            citaSeleccionada: nuevaCitaSeleccionada,
            cargando: false,
          });
        } catch (err) {
          set({ error: extraerMensajeError(err), cargando: false });
        }
      },

      // [NUEVO] Elimina o cancela definitivamente la cita en el backend y localmente
      eliminarCita: async (id) => {
        set({ cargando: true, error: null });
        try {
          await api.delete(`/consultas/${id}`);

          const citasFiltradas = get().citas.filter((c) => c.id !== id);
          const citaSeleccionadaActual = get().citaSeleccionada;

          set({
            citas: citasFiltradas,
            // Si la cita eliminada era la seleccionada, limpiamos la selección
            citaSeleccionada:
              citaSeleccionadaActual?.id === id ? null : citaSeleccionadaActual,
            cargando: false,
          });
        } catch (err) {
          set({ error: extraerMensajeError(err), cargando: false });
        }
      },

      // [NUEVO] Quita la selección actual (útil para cerrar modales de edición)
      limpiarSeleccion: () => set({ citaSeleccionada: null }),

      // [NUEVO] Limpia por completo el estado del store (ej. al hacer logout)
      resetStore: () =>
        set({
          citas: [],
          citaSeleccionada: null,
          cargando: false,
          error: null,
        }),
    }),
    { name: "CitasStore" },
  ),
);
