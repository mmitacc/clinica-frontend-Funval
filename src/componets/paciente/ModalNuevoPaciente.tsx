import React from "react";
import type { TipoSangre, EstadoPaciente } from "../../types/paciente";

// 1. Tipamos el estado del formulario de forma limpia reutilizando la estructura
interface FormNuevoPaciente {
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  masculino: boolean;
  fechanacimiento: string;
  tiposangre: TipoSangre | "";
  alergias: string;
  estado: EstadoPaciente;
  especialidadAsignada: string;
}

interface ModalNuevoPacienteProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  pacienteData: FormNuevoPaciente;
  setPacienteData: React.Dispatch<React.SetStateAction<FormNuevoPaciente>>;
  esEdicion?: boolean;
}

export function ModalNuevoPaciente({
  isOpen,
  onClose,
  onSubmit,
  pacienteData,
  setPacienteData,
  esEdicion,
}: ModalNuevoPacienteProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      {/* max-w-lg por la cantidad de campos nuevos */}
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">
            {esEdicion ? "Modificar Paciente" : "Registrar Nuevo Paciente"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-200/50 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form
          onSubmit={onSubmit}
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          {/* Nombres y Apellidos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Nombre(s)
              </label>
              <input
                required
                type="text"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={pacienteData.nombres}
                onChange={(e) =>
                  setPacienteData({
                    ...pacienteData,
                    nombres: e.target.value,
                  })
                }
                placeholder="Ej. Juan Pedro"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Apellido(s)
              </label>
              <input
                required
                type="text"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={pacienteData.apellidos}
                onChange={(e) =>
                  setPacienteData({
                    ...pacienteData,
                    apellidos: e.target.value,
                  })
                }
                placeholder="Ej. Pérez Quispe"
              />
            </div>
          </div>

          {/* Email y Teléfono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Email
              </label>
              <input
                required
                type="email"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={pacienteData.email}
                onChange={(e) =>
                  setPacienteData({ ...pacienteData, email: e.target.value })
                }
                placeholder="juan.perez@email.com"
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
                value={pacienteData.telefono}
                onChange={(e) =>
                  setPacienteData({
                    ...pacienteData,
                    telefono: e.target.value,
                  })
                }
                placeholder="+51944555661"
              />
            </div>
          </div>

          {/* Fecha de Nacimiento y Género */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Fecha de Nacimiento
              </label>
              <input
                required
                type="date"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={pacienteData.fechanacimiento}
                onChange={(e) =>
                  setPacienteData({
                    ...pacienteData,
                    fechanacimiento: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Género
              </label>
              <select
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={pacienteData.masculino ? "true" : "false"}
                onChange={(e) =>
                  setPacienteData({
                    ...pacienteData,
                    masculino: e.target.value === "true",
                  })
                }
              >
                <option value="true">Masculino</option>
                <option value="false">Femenino</option>
              </select>
            </div>
          </div>

          {/* Tipo de Sangre y Especialidad Asignada */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Tipo de Sangre
              </label>
              <select
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={pacienteData.tiposangre}
                onChange={(e) =>
                  setPacienteData({
                    ...pacienteData,
                    tiposangre: e.target.value as TipoSangre,
                  })
                }
              >
                <option value="" disabled>
                  Seleccionar
                </option>
                <option value="O_POS">O+</option>
                <option value="O_NEG">O-</option>
                <option value="A_POS">A+</option>
                <option value="A_NEG">A-</option>
                <option value="B_POS">B+</option>
                <option value="B_NEG">B-</option>
                <option value="AB_POS">AB+</option>
                <option value="AB_NEG">AB-</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Especialidad Asignada
              </label>
              <select
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={pacienteData.especialidadAsignada}
                onChange={(e) =>
                  setPacienteData({
                    ...pacienteData,
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
          </div>

          {/* Alergias */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Alergias
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={pacienteData.alergias}
              onChange={(e) =>
                setPacienteData({ ...pacienteData, alergias: e.target.value })
              }
              placeholder="Ej. Penicilina, Ninguna"
            />
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
              {esEdicion ? "Guardar Cambios" : "Registrar Paciente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
