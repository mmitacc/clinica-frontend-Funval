import { api } from "../lib/axios";
import type {
  Paciente,
  NuevoPacienteForm,
  UpdatePacienteForm,
  EstadoPaciente,
  TipoSangre,
} from "../types/paciente";

// Diccionario para transformar la sangre al formato string que espera tu API
const MAPEO_SANGRE_A_API: Record<TipoSangre, string> = {
  "O+": "O_POS",
  "O-": "O_NEG",
  "A+": "A_POS",
  "A-": "A_NEG",
  "B+": "B_POS",
  "B-": "B_NEG",
  "AB+": "AB_POS",
  "AB-": "AB_NEG",
};

// Diccionario inverso para cuando la API te devuelva la data al Frontend
const MAPEO_SANGRE_A_FRONTEND: Record<string, TipoSangre> = {
  O_POS: "O+",
  O_NEG: "O-",
  A_POS: "A+",
  A_NEG: "A-",
  B_POS: "B+",
  B_NEG: "B-",
  AB_POS: "AB+",
  AB_NEG: "AB-",
};

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
  // Convierte "B_NEG" de vuelta a "B-" para que TypeScript y tus selects no se rompan
  tiposangre: MAPEO_SANGRE_A_FRONTEND[paciente.tiposangre] || "O+",
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

  // Convertimos "B-" a "B_NEG" usando el diccionario seguro
  if (datos.tiposangre !== undefined) {
    payload.tiposangre =
      MAPEO_SANGRE_A_API[datos.tiposangre] || datos.tiposangre;
  }

  if (datos.alergias !== undefined)
    payload.alergias = datos.alergias || "Ninguna";

  // SOLO añadimos el estado si NO es una operación de creación de usuario
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
