export type EstadoMedico = "activo" | "inactivo";

export interface Medico {
  id: string;
  nombre: string;
  apellido: string;
  especialidad: string;
  estado: EstadoMedico;
}
