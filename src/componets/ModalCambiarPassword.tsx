import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cambiarPasswordAutenticadoService } from "../services/auth";
import { extraerMensajeError } from "../lib/errorHandler";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalCambiarPassword({ isOpen, onClose }: Props) {
  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { password: "", confirmarPassword: "" },
  });

  const passwordValue = watch("password");

  if (!isOpen) return null;

  const onSubmit = async (datos: { password: string }) => {
    setCargando(true);
    try {
      await cambiarPasswordAutenticadoService({ password: datos.password });
      toast.success("¡Contraseña actualizada con éxito!");
      reset(); // Limpia los campos
      onClose(); // Cierra el modal
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <h3 className="text-lg font-bold text-slate-900">Cambiar Contraseña</h3>
        <p className="text-xs text-slate-500 mt-1">
          Ingresa tu nueva clave de acceso para mayor seguridad de la cuenta.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Nueva Contraseña */}
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Nueva Contraseña
            </label>
            <div className="mt-1 relative rounded-lg shadow-sm">
              <input
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                })}
                type={mostrarPassword ? "text" : "password"} // ✅ Cambia dinámicamente
                className="appearance-none block w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {mostrarPassword ? (
                  <svg
                    className="h-4 w-4"
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
                  <svg
                    className="h-4 w-4"
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

          {/* Confirmar Contraseña */}
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Confirmar Contraseña
            </label>
            <div className="mt-1">
              <input
                {...register("confirmarPassword", {
                  required: "Debes confirmar tu contraseña",
                  validate: (value) =>
                    value === passwordValue || "Las contraseñas no coinciden",
                })}
                type={mostrarPassword ? "text" : "password"}
                className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="••••••••"
              />
            </div>
            {errors.confirmarPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errors.confirmarPassword.message}
              </p>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={cargando}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {cargando ? "Guardando..." : "Guardar clave"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
