import { api } from "../lib/axios";
import type { LoginFormData } from "../schemas/loginSchema";

export interface LoginResponse {
  data: {
    token: string;
  };
  timestamp: string;
  total: number;
}

export interface CambiarPasswordInput {
  password: string;
}

// Para autenticar un usuario que se logea
export async function loginAuthService(
  datos: LoginFormData,
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", datos);
  return data;
}

// Para cambio de contraseña de un usuario logeado
export async function cambiarPasswordAutenticadoService(
  datos: CambiarPasswordInput,
): Promise<void> {
  await api.patch("/auth/new-password", datos);
}
