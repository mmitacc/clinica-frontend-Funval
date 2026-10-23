import { api } from "../lib/axios";
import type {
  Paciente,
  NuevoPacienteForm,
  UpdatePacienteForm,
  EstadoPaciente,
} from "../types/paciente";

interface ApiResponse<T> {
  data: T;
}

// Mapeador de salida (De API a Frontend)
const convertirPaciente = (paciente: any): Paciente => ({
  id: paciente.id,
  nombres: paciente.nombres,
  apellidos: paciente.apellidos,
  telefono: paciente.telefono,
  email: paciente.email,
  masculino: paciente.masculino,
  fechanacimiento: paciente.fechanacimiento,
  tiposangre: paciente.tiposangre,
  alergias: paciente.alergias ?? "Ninguna",
  estado: (paciente.estado?.toLowerCase() as EstadoPaciente) || "ACTIVO",
  registerdate: paciente.registerdate,
  especialidadAsignada: paciente.especialidadAsignada ?? "",
  ultimaCita: paciente.ultimaCita ?? "",
});

// Mapeador de Entrada: Recibe el Partial de tus formularios y construye el JSON estricto
const convertirDatos = (datos: UpdatePacienteForm, esCreacion = false) => {
  const payload: any = {};

  if (datos.nombres !== undefined) payload.nombres = datos.nombres;
  if (datos.apellidos !== undefined) payload.apellidos = datos.apellidos;
  if (datos.telefono !== undefined) payload.telefono = datos.telefono;
  if (datos.email !== undefined) payload.email = datos.email;
  if (datos.masculino !== undefined) payload.masculino = datos.masculino;
  if (datos.fechanacimiento !== undefined)
    payload.fechanacimiento = datos.fechanacimiento;
  if (datos.tiposangre !== undefined) {
    payload.tiposangre = datos.tiposangre;
  }

  if (datos.alergias !== undefined)
    payload.alergias = datos.alergias || "Ninguna";
  if (!esCreacion && datos.estado !== undefined) {
    payload.estado = datos.estado;
  }

  return payload;
};

export const pacientesService = {
  getAll: async (estado?: EstadoPaciente) => {
    const respuesta = await api.get<ApiResponse<any[]>>("/pacientes", {
      params: estado && estado !== "todos" ? { estado } : {},
    });

    const listaPacientes = respuesta.data.data || [];
    return listaPacientes.map(convertirPaciente);
  },

  getById: async (id: string | number) => {
    const respuesta = await api.get<ApiResponse<any>>(`/pacientes/${id}`);
    return convertirPaciente(respuesta.data.data);
  },

  create: async (datos: NuevoPacienteForm) => {
    // Pasamos true para avisarle al mapeador que elimine el campo "estado" del JSON
    const payloadLimpio = convertirDatos(datos, true);

    const respuesta = await api.post<ApiResponse<any>>(
      "/pacientes",
      payloadLimpio,
    );
    return convertirPaciente(respuesta.data.data);
  },

  update: async (id: string | number, datos: UpdatePacienteForm) => {
    // Aquí pasamos false (por defecto) porque la edición sí podría requerir actualizar el estado
    const payloadLimpio = convertirDatos(datos, false);

    const respuesta = await api.patch<ApiResponse<any>>(
      `/pacientes/${id}`,
      payloadLimpio,
    );
    return convertirPaciente(respuesta.data.data);
  },

  delete: (id: string | number) => api.delete(`/pacientes/${id}`),
};
