import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { extraerMensajeError } from "../lib/errorHandler";
import { api } from "../lib/axios";
import type { Consulta, EstadoConsulta } from "../types/Consulta";

// Interfaz del Estado y las Acciones del Store
interface CitasState {
  citas: Consulta[];
  citaSeleccionada: Consulta | null;
  cargando: boolean;
  error: string | null;
  cargarPorPaciente: (idPaciente: number) => Promise<void>;
  seleccionar: (id: number) => void;
  actualizarEstado: (id: number, estado: EstadoConsulta) => Promise<void>;
  agregarCita: (cita: Omit<Consulta, "id" | "registerdate">) => Promise<void>;
}

// Creación del Store con Zustand y Devtools
export const useCitasStore = create<CitasState>()(
  devtools(
    (set, get) => ({
      citas: [],
      citaSeleccionada: null,
      cargando: false,
      error: null,

      // Carga las citas de un paciente específico desde la API
      cargarPorPaciente: async (idPaciente) => {
        set({ cargando: true, error: null });
        try {
          const res = await api.get(`/citas/paciente/${idPaciente}`);
          // Ajusta 'res.data.data' según la estructura exacta que devuelva tu backend
          set({ citas: res.data.data || res.data, cargando: false });
        } catch (err) {
          set({ error: extraerMensajeError(err), cargando: false });
        }
      },

      // Busca la cita en memoria local usando .find() para evitar peticiones HTTP extras
      seleccionar: (id) => {
        const { citas } = get();
        const cita = citas.find((c) => c.id === id) || null;
        set({ citaSeleccionada: cita });
      },

      // Actualiza el estado de la cita en el servidor y sincroniza el estado local
      actualizarEstado: async (id, estado) => {
        set({ cargando: true, error: null });
        try {
          await api.patch(`/citas/${id}/estado`, { estado });

          // Mapeamos el array local para reflejar el cambio de estado de manera reactiva
          const citasActualizadas = get().citas.map((c) =>
            c.id === id ? { ...c, estado } : c,
          );

          // Si la cita editada es la que está seleccionada actualmente, también la actualizamos
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
        try {
          const res = await api.post("/citas", nuevaCita);
          const citaCreada = res.data.data || res.data;

          set((state) => ({
            citas: [...state.citas, citaCreada],
            cargando: false,
          }));
        } catch (err) {
          set({ error: extraerMensajeError(err), cargando: false });
        }
      },
    }),
    { name: "CitasStore" },
  ),
);
