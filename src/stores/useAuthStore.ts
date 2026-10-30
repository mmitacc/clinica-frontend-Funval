import { create } from "zustand";
import { persist } from "zustand/middleware";
import { perfilService } from "../services/perfil";

export interface UsuarioAutenticado {
  id: number;
  username: string;
  email: string;
  role: string;
  foto?: string | null;
  telefono?: string | null;
}

interface AuthState {
  token: string | null;
  usuario: UsuarioAutenticado | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  actualizarPerfil: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      usuario: null,
      isAuthenticated: false,
      usuarioAvatar: null,
      login: async (token) => {
        try {
          set({ token, isAuthenticated: true });
          const datosCompletosUsuario = await perfilService.obtener();
          set({ usuario: datosCompletosUsuario });
        } catch (error) {
          get().logout();
          throw error;
        }
      },
      logout: () => set({ token: null, usuario: null, isAuthenticated: false }),
      actualizarPerfil: async () => {
        try {
          // Vamos directamente al backend a jalar la data recién guardada
          const datosFrescos = await perfilService.obtener();

          // Re-setear el usuario fuerza a React a pintar los cambios al instante
          set({ usuario: datosFrescos });
        } catch (error) {
          console.error("Error al sincronizar el perfil modificado:", error);
        }
      },
    }),
    { name: "auth-storage" },
  ),
);
