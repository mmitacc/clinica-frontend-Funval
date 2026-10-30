import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuthStore } from "../stores/useAuthStore";
import { InputFotoPerfil } from "../componets/InputFotoPerfil";
import { perfilService, type PerfilFormData } from "../services/perfil";

export function PaginaPerfil({ onClose }: { onClose?: () => void }) {
  const { usuario, actualizarPerfil } = useAuthStore();
  const [archivoFoto, setArchivoFoto] = useState<File | null>(null);
  console.log("usuario => ", usuario);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<PerfilFormData>({
    defaultValues: {
      username: usuario?.username || "",
      telefono: usuario?.telefono || "",
    },
  });

  const onSubmit = async (datos: PerfilFormData) => {
    try {
      // 1. Enviamos el FormData con la nueva foto o textos al backend
      await perfilService.actualizar(datos, archivoFoto);

      // 2. 💡 LA MAGIA: Forzamos a Zustand a re-consultar el /auth/profile fresco
      await actualizarPerfil();

      toast.success("Perfil actualizado correctamente");
      if (onClose) onClose();
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Error al actualizar el perfil";
      toast.error(msg);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Mi Perfil Clínico</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm transition-colors"
          >
            Cerrar
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* InputFotoPerfil Integrado */}
        <InputFotoPerfil
          fotoActual={usuario?.foto}
          onChange={(archivo) => setArchivoFoto(archivo)}
          isLoading={isSubmitting}
          role={usuario?.role as any} // 'MEDICO' | 'ADMIN' etc.
        />

        {/* Campos de texto */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Nombre de Usuario / Médico
          </label>
          <input
            type="text"
            {...register("username", { required: "El nombre es obligatorio" })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Correo Electrónico (No modificable)
          </label>
          <input
            type="email"
            value={usuario?.email || ""}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
            disabled
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Teléfono de Contacto
          </label>
          <input
            type="text"
            {...register("telefono")}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Botón Guardar */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed shadow-sm"
        >
          {isSubmitting ? "Guardando cambios en la nube..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}
