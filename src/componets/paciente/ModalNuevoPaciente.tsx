interface ModalNuevoPacienteProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  nuevoPaciente: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    especialidadAsignada: string;
  };
  setNuevoPaciente: React.Dispatch<
    React.SetStateAction<{
      nombre: string;
      apellido: string;
      email: string;
      telefono: string;
      especialidadAsignada: string;
    }>
  >;
}

export function ModalNuevoPaciente({
  isOpen,
  onClose,
  onSubmit,
  nuevoPaciente,
  setNuevoPaciente,
}: ModalNuevoPacienteProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">
            Registrar Nuevo Paciente
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-200/50 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Nombre
              </label>
              <input
                required
                type="text"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={nuevoPaciente.nombre}
                onChange={(e) =>
                  setNuevoPaciente({ ...nuevoPaciente, nombre: e.target.value })
                }
                placeholder="Ej. Ana Sofía"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Apellido
              </label>
              <input
                required
                type="text"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={nuevoPaciente.apellido}
                onChange={(e) =>
                  setNuevoPaciente({
                    ...nuevoPaciente,
                    apellido: e.target.value,
                  })
                }
                placeholder="Ej. Martínez"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Email
            </label>
            <input
              required
              type="email"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={nuevoPaciente.email}
              onChange={(e) =>
                setNuevoPaciente({ ...nuevoPaciente, email: e.target.value })
              }
              placeholder="ana.martinez@email.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Teléfono
            </label>
            <input
              required
              type="text"
              pattern="^\+?[0-9\s]{9,15}$"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={nuevoPaciente.telefono}
              onChange={(e) =>
                setNuevoPaciente({ ...nuevoPaciente, telefono: e.target.value })
              }
              placeholder="+34 645 678 901"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Especialidad Asignada
            </label>
            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={nuevoPaciente.especialidadAsignada}
              onChange={(e) =>
                setNuevoPaciente({
                  ...nuevoPaciente,
                  especialidadAsignada: e.target.value,
                })
              }
            >
              <option value="General">Medicina General</option>
              <option value="Neurología">Neurología</option>
              <option value="Cardiología">Cardiología</option>
              <option value="Pediatría">Pediatría</option>
            </select>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-xl shadow-sm transition-colors"
            >
              Guardar Paciente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
