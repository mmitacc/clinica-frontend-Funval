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
  onEliminar?: (id: string) => void; // <-- NUEVA PROP
  onCambiarEstado?: (id: string, nuevoEstado: Paciente["estado"]) => void; // <-- NUEVA PROP
}

export function PacienteCard({
  paciente,
  onEditar,
  onVerDetalles,
  onEliminar,
  onCambiarEstado,
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

  const iniciales = `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg max-w-sm w-full">
      <div>
        {/* Header: Avatar, Nombre, ID y Selector de Estado */}
        <header className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-300 to-slate-50 text-xl font-bold tracking-wide shadow-inner"
              aria-hidden="true"
            >
              <BadgeEstado estado={estado} texto={iniciales} />
            </div>
            <div className="min-w-0">
              <h3
                title={`${nombre} ${apellido}`}
                className="truncate text-base font-semibold text-slate-900 group-hover:text-slate-700 transition-colors"
              >
                {nombre} {apellido}
              </h3>
            </div>
          </div>

          {/* Selector de Estado Interactivo */}
          <div className="shrink-0 relative">
            <select
              value={estado}
              onChange={(e) =>
                onCambiarEstado?.(id, e.target.value as Paciente["estado"])
              }
              className={`appearance-none cursor-pointer text-xs font-semibold pl-3 pr-7 py-1.5 rounded-full ring-1 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/45 ${
                estado === "activo"
                  ? "bg-green-50 text-green-700 ring-green-600/20 hover:bg-green-100"
                  : estado === "en_espera"
                    ? "bg-amber-50 text-amber-700 ring-amber-600/20 hover:bg-amber-100"
                    : "bg-slate-100 text-slate-700 ring-slate-600/20 hover:bg-slate-200"
              }`}
            >
              <option value="activo">activo</option>
              <option value="en_espera">en_espera</option>
              <option value="inactivo">inactivo</option>
            </select>
            {/* Pequeño icono de flecha hacia abajo personalizado */}
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-400">
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
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
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25 2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
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
              strokeWidth="1.75"
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
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-2 text-xs font-semibold text-blue-700 transition-all hover:bg-blue-100 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-600/50"
          >
            Ver ficha
          </button>

          <button
            type="button"
            onClick={() => onEditar?.(id)}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-400/40"
          >
            Editar
          </button>

          {/* Botón de Eliminar Agregado */}
          <button
            type="button"
            onClick={() => onEliminar?.(id)}
            className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2 text-xs font-medium text-red-600 transition-all hover:bg-red-100 hover:border-red-300 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-500/40"
            title="Eliminar paciente"
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
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-1.816A2.25 2.25 0 0013.812 1.5h-3.623a2.25 2.25 0 00-2.25 2.255V3.39m7.5 0V1.5"
              />
            </svg>
          </button>
        </div>
      </footer>
    </article>
  );
}
