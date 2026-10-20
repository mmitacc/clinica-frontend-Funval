export type EstadoPaciente = "todos" | "ACTIVO" | "INACTIVO" | "EN_ESPERA";
export type TipoSangre =
  | "O+"
  | "O-"
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-";

export interface Paciente {
  id: string | number;
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  masculino: boolean;
  fechanacimiento: string;
  tiposangre: TipoSangre;
  alergias: string;
  estado: EstadoPaciente;
  registerdate?: string;
  especialidadAsignada?: string;
  ultimaCita?: string;
}

export type NuevoPacienteForm = Omit<
  Paciente,
  "id" | "registerdate" | "especialidadAsignada"
>;
