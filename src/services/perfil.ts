import { api } from "../lib/axios";

export interface PerfilFormData {
  username: string;
  telefono?: string;
}

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  role: string;
  foto: string | null;
  telefono?: string | null;
  nombres?: string;
  apellidos?: string;
}

export const perfilService = {
  obtener: () =>
    api.get<{ data: UserProfile }>("/auth/profile").then((r) => r.data.data),

  actualizar: (datos: PerfilFormData, foto?: File | null) => {
    const formData = new FormData();
    formData.append("username", datos.username);

    if (datos.telefono) {
      formData.append("telefono", datos.telefono);
    }
    if (foto) {
      formData.append("foto", foto);
    }
    return api.put<UserProfile>("/auth/perfil", formData).then((r) => r.data);
  },
};
