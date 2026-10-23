export type EstadoPaciente = "todos" | "ACTIVO" | "INACTIVO" | "EN_ESPERA";
export type TipoSangre =
  | "O_POS"
  | "O_NEG"
  | "A_POS"
  | "A_NEG"
  | "B_POS"
  | "B_NEG"
  | "AB_POS"
  | "AB_NEG";

export interface Paciente {
  id: string | number;
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  masculino: boolean;
  fechanacimiento: string;
  tiposangre: TipoSangre;
  alergias: string | null;
  estado: EstadoPaciente;
  registerdate?: string;
  especialidadAsignada?: string;
  ultimaCita?: string;
}

export type NuevoPacienteForm = Omit<
  Paciente,
  "id" | "registerdate" | "especialidadAsignada" | "ultimaCita"
>;

export type UpdatePacienteForm = Partial<Paciente>;
