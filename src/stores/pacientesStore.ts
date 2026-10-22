import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { extraerMensajeError } from "../lib/errorHandler";
import type { Paciente, NuevoPacienteForm } from "../types/paciente";
import { api } from "../lib/axios";

// ==========================================
// 1. INTERFAZ DE TIPOS (Aquí va lo que preguntaste)
// ==========================================
interface PacientesState {
  pacientes: Paciente[];
  pacienteSeleccionado: Paciente | null; // Para la vista de detalle
  cargando: boolean;
  error: string | null;
  cargar: (query?: string) => Promise<void>;
  cargarPorId: (id: string | number) => Promise<void>;

  // Omitimos 'id' y 'estado' para que no de error en handleGuardarPaciente
  crear: (nuevoPaciente: NuevoPacienteForm) => Promise<void>;

  actualizar: (
    id: string | number,
    datosActualizados: Partial<Paciente>,
  ) => Promise<void>;
  eliminar: (id: string | number) => Promise<void>;
}

// ==========================================
// 2. CREACIÓN DEL STORE CON ZUSTAND
// ==========================================
export const usePacientesStore = create<PacientesState>()(
  devtools(
    (set, get) => ({
      // --- Estado Inicial ---
      pacientes: [],
      pacienteSeleccionado: null,
      cargando: false,
      error: null,

      // --- Acciones / Métodos ---

      // Cargar listado general de pacientes desde la API
      cargar: async (query) => {
        set({ cargando: true, error: null });
        try {
          const res = await api.get("/pacientes", { params: { query } });
          set({ pacientes: res.data.data || res.data, cargando: false });
        } catch (err) {
          set({ error: extraerMensajeError(err), cargando: false });
          throw err;
        }
      },

      // Cargar un único paciente por ID (Optimizado: busca en memoria o va a la API)
      cargarPorId: async (id) => {
        set({ cargando: true, error: null });

        const pacienteEnMemoria = get().pacientes.find(
          (p) => String(p.id) === String(id),
        );
        if (pacienteEnMemoria) {
          set({ pacienteSeleccionado: pacienteEnMemoria, cargando: false });
          return;
        }

        try {
          const res = await api.get(`/pacientes/${id}`); // Singular según tu backend
          set({
            pacienteSeleccionado: res.data.data || res.data,
            cargando: false,
          });
        } catch (err) {
          set({ error: extraerMensajeError(err), cargando: false });
          throw err;
        }
      },

      // Crear un nuevo paciente en el servidor
      crear: async (nuevoPaciente) => {
        console.log('nuevoPaciente => ',nuevoPaciente);
        
        set({ cargando: true });
        try {
          const res = await api.post("/pacientes", nuevoPaciente);
          const pacienteCreado = res.data.data || res.data;

          set((state) => ({
            pacientes: [...state.pacientes, pacienteCreado],
            cargando: false,
          }));
        } catch (err) {
          set({ cargando: false });
          throw err;
        }
      },

      // Actualizar un paciente existente (Corregido a singular)
      actualizar: async (id, datosActualizados) => {
        set({ cargando: true });
        try {
          const res = await api.patch(`/pacientes/${id}`, datosActualizados);
          const pacienteEditado = res.data.data || res.data;

          const pacientesActualizados = get().pacientes.map((p) =>
            p.id === id ? pacienteEditado : p,
          );

          set({ pacientes: pacientesActualizados, cargando: false });
        } catch (err) {
          set({ cargando: false });
          throw err;
        }
      },

      // Eliminar un paciente (Corregido a singular)
      eliminar: async (id) => {
        set({ cargando: true });
        try {
          await api.delete(`/pacientes/${id}`); // Singular

          const pacientesFiltrados = get().pacientes.filter((p) => p.id !== id);

          set({ pacientes: pacientesFiltrados, cargando: false });
        } catch (err) {
          set({ cargando: false });
          throw err;
        }
      },
    }),
    { name: "PacientesStore" },
  ),
);
