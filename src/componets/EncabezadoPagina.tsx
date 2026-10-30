import React from "react";

interface EncabezadoPaginaProps {
  titulo: string;
  descripcion?: string;
  children?: React.ReactNode;
}

export default function EncabezadoPagina({ titulo, descripcion, children }: EncabezadoPaginaProps) {
  return (
    // Contenedor principal alineado al centro vertical en pantallas grandes
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-5 w-full">
      
      {/* Sección Izquierda: Icono + Textos apilados */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Icono unificado */}
        <div className="p-2.5 bg-blue-500 rounded-xl text-white shadow-md shadow-blue-100 flex items-center justify-center shrink-0">
          <svg
            className="h-5 w-5"
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

        {/* Bloque de Textos: 💡 CORREGIDO para empaquetar título y descripción muy pegados */}
        <div className="flex flex-col min-w-0 space-y-0.5">
          {/* 💡 CORREGIDO: Eliminamos el 'truncate' para permitir las 2 líneas y añadimos 'leading-tight' */}
          <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight max-w-md md:max-w-xl">
            {titulo}
          </h1>
          {descripcion && (
            // 💡 CORREGIDO: 'leading-normal' y texto limpio alineado al inicio del bloque de texto
            <p className="text-xs text-slate-500 font-medium leading-normal block">
              {descripcion}
            </p>
          )}
        </div>
      </div>

      {/* Sección Derecha: Selector o Filtros */}
      {children && (
        <div className="w-full md:w-auto flex items-center justify-start md:justify-end shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}
