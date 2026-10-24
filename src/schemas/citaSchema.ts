import { z } from "zod";

// Expresión regular estricta para formato HH:MM (de 00:00 a 23:59)
const horaRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

export const citaSchema = z.object({
  pacienteId: z
    .string()
    .min(1, { message: "Debe seleccionar un paciente de la lista" }),

  medicoId: z.string().min(1, { message: "Debe seleccionar un médico" }),

  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Formato de fecha inválido (YYYY-MM-DD)",
    })
    .refine(
      (fechaStr) => {
        // Obtenemos la fecha actual en formato local YYYY-MM-DD sin problemas de zona horaria
        const hoy = new Date().toLocaleDateString("en-CA"); // Retorna exactamente YYYY-MM-DD
        return fechaStr >= hoy;
      },
      { message: "La fecha no puede ser anterior al día de hoy" },
    ),

  costo: z.number().min(0, "El costo no puede ser negativo"),

  hora: z.string().regex(horaRegex, {
    message: "La hora debe tener un formato válido de 24 horas (HH:MM)",
  }),

  motivo: z
    .string()
    .min(10, { message: "El motivo debe tener al menos 10 caracteres" })
    .max(500, { message: "El motivo no puede superar los 500 caracteres" }),

  urgencia: z.enum(["baja", "media", "alta", "critica"], {
    message: "Seleccione un nivel de urgencia válido",
  }),
});

// Inferimos el tipo de TypeScript automáticamente desde el esquema de Zod
export type CitaFormData = z.infer<typeof citaSchema>;
