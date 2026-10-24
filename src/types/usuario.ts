export type Role = "RECEPCIONISTA" | "MEDICO" | "GERENCIA" | "ADMIN";
export type EstadoUsuario = "activo" | "inactivo";

export interface Usuario {
  id: string | number;
  nombres: string;
  apellidos: string;
  telefono: string;
  masculino: boolean;
  fechanacimiento: string;
  email: string;
  role: Role;
  username: string;
  registerdate?: string;
  especialidad?: string;
  estado: EstadoUsuario;
}
