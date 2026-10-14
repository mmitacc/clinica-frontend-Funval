// Problemas encontrados en el código generado por la IA:
// 1. Se pidio explicitamente una Card para pacientes y genero un catalogo de Cards
// 2. Detalla metricas que no se pidieron
// 3. Genero link a Ficha que aún no existen y boton edición para cambiar los datos
// En general no respeta lo que se indica explicitamente y genera demás
// en todo lo posible y de forma aleatoria.

import type { Paciente } from "../../types/paciente";
import { BadgeEstado } from "./BadgeEstado";

interface PacienteCardProps {
  paciente: Paciente;
  onVerDetalles?: (id: string) => void;
  onEditar?: (id: string) => void;
}

export function PacienteCard({
  paciente,
  onEditar,
  onVerDetalles,
}: PacienteCardProps) {
  const {
    id,
    nombre,
    apellido,
    email,
    telefono,
    especialidadAsignada,
    ultimaCita,
    estado,
  } = paciente;
  // Obtener iniciales automáticamente (ej: "Sofía Morales" -> "SM")
  const iniciales = `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg max-w-sm w-full">
      <div>
        {/* Header: Avatar, Name, ID, BadgeEstado */}
        <header className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-300 to-slate-50 text-xl font-bold tracking-wide shadow-inner"
              aria-hidden="true"
            >
              <BadgeEstado estado={estado} texto={iniciales} />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                {nombre} {apellido}
              </h3>
              <p className="text-xs font-mono text-slate-400">ID: {id}</p>
            </div>
          </div>

          {/* Tu componente modular de estado */}
          <div className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-50 ring-1 ring-slate-200">
            <BadgeEstado estado={estado} texto={estado} />
          </div>
        </header>

        {/* Especialidad asignada */}
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 border border-slate-100">
          <svg
            className="h-4 w-4 shrink-0 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H7.5m5.25 11.25h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
            />
          </svg>
          <span className="truncate">
            <span className="text-slate-400 font-normal">Especialidad:</span>{" "}
            {especialidadAsignada}
          </span>
        </div>

        {/* Datos de contacto */}
        <dl className="mt-3.5 space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2.5">
            <dt className="sr-only">Correo electrónico</dt>
            <dd className="flex items-center gap-2 truncate">
              <svg
                className="h-4 w-4 shrink-0 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              <a
                href={`mailto:${email}`}
                className="truncate hover:text-slate-900 transition-colors"
              >
                {email}
              </a>
            </dd>
          </div>

          <div className="flex items-center gap-2.5">
            <dt className="sr-only">Teléfono</dt>
            <dd className="flex items-center gap-2 truncate">
              <svg
                className="h-4 w-4 shrink-0 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
              <span className="font-mono text-slate-700">{telefono}</span>
            </dd>
          </div>
        </dl>
      </div>

      {/* Footer con última cita y acciones */}
      <footer className="mt-5 border-t border-slate-100 pt-3.5">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3.5">
          <span className="flex items-center gap-1.5 text-slate-400">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.75"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
            Última cita:
          </span>
          <time className="font-medium text-slate-700">{ultimaCita}</time>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onVerDetalles?.(id)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition-all hover:bg-blue-100 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-600/50"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Ver ficha
          </button>
          <button
            type="button"
            onClick={() => onEditar?.(id)}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-400/40"
          >
            <svg
              className="h-3.5 w-3.5 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              />
            </svg>
            Editar
          </button>
        </div>
      </footer>
    </article>
  );
}
