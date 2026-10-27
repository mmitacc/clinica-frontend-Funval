import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router";
import type { LoginFormData } from "../schemas/loginSchema";
import { toast } from "sonner";
import { extraerMensajeError } from "../lib/errorHandler";
import { loginAuthService } from "../services/auth";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function PaginaLogin() {
  const { login: setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (datos: LoginFormData) => {
    setCargando(true);
    try {
      const respuesta = await loginAuthService(datos);
      const token = respuesta.data.token;
      const base64Payload = token.split(".")[1];
      const payloadDecodificado = JSON.parse(atob(base64Payload));
      const usuario = {
        id: payloadDecodificado.sub || payloadDecodificado.id,
        username: payloadDecodificado.username,
        email: payloadDecodificado.email,
        role: payloadDecodificado.role,
      };
      setAuth(token, usuario);
      toast.success(`¡Bienvenido: ${usuario.username}!`);
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-500 rounded-2xl text-white shadow-md shadow-black-300 flex items-center justify-center">
            {/* Icono nativo de usuarios */}
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Sistema Clínico
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Inicia sesión para gestionar citas e historias médicas
        </p>
      </div>

      <div className="mt-8 sm:mx-auto w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md sm:rounded-xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Campo: Email / Usuario */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Correo Electrónico
              </label>
              <div className="mt-1">
                <input
                  {...register("email", {
                    required: "El usuario es obligatorio",
                  })}
                  id="email"
                  type="text"
                  autoComplete="email"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.email
                      ? "border-red-300 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-300 placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 sm:text-sm transition-colors`}
                  placeholder="ejemplo@clinica.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Campo: Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Contraseña
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <input
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                  })}
                  id="password"
                  type={mostrarPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`appearance-none block w-full pl-3 pr-10 py-2 border ${
                    errors.password
                      ? "border-red-300 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-300 placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500"
                  } rounded-lg focus:outline-none focus:ring-2 sm:text-sm transition-colors`}
                  placeholder="••••••••"
                />

                {/* Botón del Ojo */}
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {mostrarPassword ? (
                    // Icono: Ojo tachado (Ocultar)
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    // Icono: Ojo abierto (Mostrar)
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Opciones extras típicas del Login */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-xs text-slate-700"
                >
                  Recordarme en este equipo
                </label>
              </div>

              <div className="text-xs">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            {/* Botón Submit */}
            <div>
              <button
                type="submit"
                disabled={cargando}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {cargando ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Autenticando...
                  </span>
                ) : (
                  "Ingresar al Portal"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
