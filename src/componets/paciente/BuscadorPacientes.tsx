interface BuscadorPacientesProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function BuscadorPacientes({
  value,
  onChange,
  placeholder = "Buscar paciente por nombre, apellido, especialidad...",
}: BuscadorPacientesProps) {
  return (
    <div className="relative w-full max-w-md">
      {/* Icono de Lupa */}
      <div
        className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none"
        aria-hidden="true"
      >
        <svg
          className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Input de Búsqueda */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 text-sm bg-white text-slate-900 border border-slate-200/90 rounded-xl shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:shadow-md"
      />

      {/* Botón rápido para limpiar (X) - Solo visible si hay texto */}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
