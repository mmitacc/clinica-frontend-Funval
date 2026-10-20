export type EstadoConsulta = "PROGRAMADA" | "COMPLETADA" | "CANCELADA";

export interface Consulta {
  id: number;
  id_paciente: number;
  id_usuario: number;
  estado: EstadoConsulta;
  costo: string;
  registerdate: string;
  fecha: string;
  horario: string;
}
