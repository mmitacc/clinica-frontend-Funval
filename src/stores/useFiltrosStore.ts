import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { EstadoConsulta } from "../types/consulta";

export type EstadoCitaFiltro = EstadoConsulta | "todos";
export type EstadoPacienteFiltro =
  | "todos"
  | "ACTIVO"
  | "INACTIVO"
  | "EN_ESPERA";

interface FiltrosState {
  queryPacientes: string;
  especialidadFiltro: string;
  estadoCitaFiltro: EstadoCitaFiltro;
  estadoPacienteFiltro: EstadoPacienteFiltro; // Nuevo estado para pacientes
  setQueryPacientes: (query: string) => void;
  setEspecialidad: (especialidad: string) => void;
  setEstadoCita: (estado: EstadoCitaFiltro) => void;
  setEstadoPaciente: (estado: EstadoPacienteFiltro) => void; // Nueva acción
  resetFiltros: () => void;
}

const estadoInicial = {
  queryPacientes: "",
  especialidadFiltro: "",
  estadoCitaFiltro: "todos" as EstadoCitaFiltro,
  estadoPacienteFiltro: "todos" as EstadoPacienteFiltro, // Inicializador
};

export const useFiltrosStore = create<FiltrosState>()(
  devtools(
    (set) => ({
      ...estadoInicial,
      setQueryPacientes: (query) =>
        set({ queryPacientes: query }, false, "setQueryPacientes"),
      setEspecialidad: (especialidad) =>
        set({ especialidadFiltro: especialidad }, false, "setEspecialidad"),
      setEstadoCita: (estado) =>
        set({ estadoCitaFiltro: estado }, false, "setEstadoCita"),
      setEstadoPaciente: (estado) =>
        set({ estadoPacienteFiltro: estado }, false, "setEstadoPaciente"),
      resetFiltros: () => set(estadoInicial, false, "resetFiltros"),
    }),
    { name: "FiltrosStore" },
  ),
);
