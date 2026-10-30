import React, { useState, useRef } from "react";
import { toast } from "sonner";

interface InputFotoPerfilProps {
  fotoActual?: string | null; // Aceptamos string o null proveniente de Prisma/Cloudinary
  onChange: (archivo: File | null) => void;
  isLoading?: boolean;
  role?: "RECEPCIONISTA" | "MEDICO" | "GERENCIA" | "ADMIN";
}

export function InputFotoPerfil({
  fotoActual,
  onChange,
  isLoading = false,
  role = "RECEPCIONISTA", // 💡 CORREGIDO: Valor por defecto alineado a las opciones de tu enum/interfaz
}: InputFotoPerfilProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 💡 CORREGIDO: Marcadores de posición profesionales según el rol clínico real de tu DB
  const avatarPorDefecto =
    role === "MEDICO"
      ? "/public/medico.svg"
      : role === "ADMIN"
        ? "/public/admin.svg"
        : role === "GERENCIA"
          ? "/public/gerente.svg"
          : "/public/recepcionista.svg";

  const handleSeleccion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      toast.error("El archivo debe ser una imagen (PNG, JPG, WEBP)");
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      toast.error("La imagen de perfil no puede superar los 5MB");
      return;
    }

    const objectUrl = URL.createObjectURL(archivo);
    setPreview(objectUrl);
    onChange(archivo);
  };

  const handleEliminar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50 max-w-sm mx-auto">
      <div className="relative group w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-200">
        {/* Imagen de Perfil */}
        <img
          src={preview ?? fotoActual ?? avatarPorDefecto}
          alt="Foto de perfil de la clínica"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Capa de carga o Hover para cambiar */}
        {isLoading ? (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-medium transition-opacity duration-200 cursor-pointer"
          >
            {/* 💡 CORREGIDO: URI de namespace XML del SVG corregida */}
            <svg
              xmlns="http://w3.org"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 mb-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
              />
            </svg>
            Cambiar foto
          </button>
        )}
      </div>

      {/* Input oculto */}
      <input
        type="file"
        ref={inputRef}
        onChange={handleSeleccion}
        accept="image/*"
        disabled={isLoading}
        className="hidden"
      />

      {/* Controles e Indicaciones */}
      <div className="text-center">
        <p className="text-xs text-slate-500 font-medium">
          Formatos aceptados: JPG, PNG, WEBP. Máx. 5MB
        </p>

        {(preview || fotoActual) && !isLoading && (
          <button
            type="button"
            onClick={handleEliminar}
            className="mt-2 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
          >
            Quitar foto actual
          </button>
        )}
      </div>
    </div>
  );
}
