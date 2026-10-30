import z from "zod";

export const perfilSchema = z.object({
  username: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.email("Ingresa un email válido"),
  telefono: z
    .string()
    .regex(/^\d{8,15}$/, "Ingresa un teléfono válido")
    .optional(),
});
