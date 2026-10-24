import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { citaSchema } from "../schemas/citaSchema";
import type { CitaFormData } from "../schemas/citaSchema";
import useMedicos from "../componets/hooks/useMedicos";
import usePacientes from "../componets/hooks/usePacientes";

export default function FormularioCita() {
  const { medicos, cargando: cargandoMedicos } = useMedicos();
  const { pacientes, cargando: cargandoPacientes } = usePacientes();
  const [citaExitosa, setCitaExitosa] = useState<CitaFormData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CitaFormData>({
    resolver: zodResolver(citaSchema),
    defaultValues: {
      pacienteId: "",
      medicoId: "",
      fecha: "",
      hora: "",
      motivo: "",
      urgencia: "baja",
    },
  });

  const onSubmit = async (data: CitaFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setCitaExitosa(data);
  };

  const manejarNuevaCita = () => {
    setCitaExitosa(null);
    reset();
  };

  const hoyStr = new Date().toLocaleDateString("en-CA");

  // PANTALLA DE CONFIRMACIÓN (ÉXITO)
  if (citaExitosa) {
    const medicoSeleccionado = medicos.find(
      (m) => m.id === citaExitosa.medicoId,
    );
    const pacienteSeleccionado = pacientes.find(
      (p) => p.id === citaExitosa.pacienteId,
    );

    return (
      <div className="max-w-xl mx-auto mt-10 p-8 bg-emerald-50 rounded-xl shadow-lg border border-emerald-200 text-center">
        <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-md">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-emerald-800 mb-2">
          ¡Cita Agendada con Éxito!
        </h2>
        <p className="text-emerald-600 text-sm mb-6">
          El registro se completó correctamente.
        </p>

        <div className="bg-white rounded-lg p-5 text-left border border-emerald-100 shadow-sm space-y-3 mb-6">
          <p className="text-sm text-slate-600">
            <strong className="text-slate-800">Paciente:</strong>{" "}
            {pacienteSeleccionado
              ? `${pacienteSeleccionado.nombres} ${pacienteSeleccionado.apellidos}`
              : "Desconocido"}
          </p>
          <p className="text-sm text-slate-600">
            <strong className="text-slate-800">Médico:</strong>{" "}
            {medicoSeleccionado
              ? `Dr(a). ${medicoSeleccionado.nombres} ${medicoSeleccionado.apellidos} (${medicoSeleccionado.especialidad})`
              : "No asignado"}
          </p>
          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
            <p className="text-sm text-slate-600">
              <strong className="text-slate-800">Fecha:</strong>{" "}
              {citaExitosa.fecha}
            </p>
            <p className="text-sm text-slate-600">
              <strong className="text-slate-800">Hora:</strong>{" "}
              {citaExitosa.hora} hrs
            </p>
          </div>
          <p className="text-sm text-slate-600 capitalize">
            <strong className="text-slate-800">Urgencia:</strong>{" "}
            {citaExitosa.urgencia}
          </p>
          <p className="text-sm text-slate-600 border-t border-slate-100 pt-3">
            <strong className="text-slate-800">Motivo:</strong>{" "}
            {citaExitosa.motivo}
          </p>
        </div>

        <button
          onClick={manejarNuevaCita}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-all"
        >
          Agendar otra cita
        </button>
      </div>
    );
  }

  // FORMULARIO PRINCIPAL
  return (
    <div className="min-h-screen bg-slate-50/50 px-6 py-4 md:py-6">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Cabecera de la Sección */}
        <header className="w-full text-center space-y-1 pb-3">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2.5 bg-blue-500 rounded-xl text-white shadow-md shadow-blue-100 flex items-center justify-center shrink-0">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Módulo de Citas
            </h1>
          </div>
          <div className="flex items-center justify-center gap-3">
            <p className="text-sm text-slate-500 max-w-md mx-auto text-center">
              Registra una cita médica con un paciente registrado.
            </p>
          </div>
        </header>

        {/* Formulario para nueva cita */}
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Agendar Nueva Cita
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Selector / Buscador de Pacientes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Paciente (Escribe para buscar)
              </label>

              {/* El input donde el usuario escribe */}
              <input
                type="text"
                list="lista-pacientes" // Conecta este input con el datalist de abajo
                placeholder={
                  cargandoPacientes
                    ? "Cargando lista de pacientes..."
                    : "Escribe nombre, apellido o ID..."
                }
                disabled={cargandoPacientes}
                {...register("pacienteId")}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.pacienteId
                    ? "border-red-500 focus:ring-red-200 bg-red-50"
                    : "border-slate-300 focus:ring-blue-100 focus:border-blue-500"
                }`}
              />

              {/* El contenedor oculto con las opciones autocompletables */}
              <datalist id="lista-pacientes">
                {pacientes.map((pac) => (
                  // value: Lo que se guarda internamente (el ID para Zod)
                  // label: El texto descriptivo que el navegador usa para buscar
                  <option
                    key={pac.id}
                    value={pac.id}
                    label={`${pac.nombres} ${pac.apellidos}`}
                  />
                ))}
              </datalist>

              {errors.pacienteId && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  ⚠ {errors.pacienteId.message}
                </p>
              )}
            </div>

            {/* Selector de Médicos */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Médico Asignado
              </label>
              <select
                {...register("medicoId")}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.medicoId
                    ? "border-red-500 focus:ring-red-200 bg-red-50"
                    : "border-slate-300 focus:ring-blue-100 focus:border-blue-500"
                }`}
              >
                {cargandoMedicos ? (
                  <option disabled value="">
                    Cargando médicos...
                  </option>
                ) : (
                  <>
                    <option value="">Seleccione un especialista...</option>
                    {medicos.map((med) => (
                      <option key={med.id} value={med.id}>
                        Dr(a). {med.nombres} {med.apellidos} ({med.especialidad}
                        )
                      </option>
                    ))}
                  </>
                )}
              </select>
              {errors.medicoId && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  ⚠ {errors.medicoId.message}
                </p>
              )}
            </div>

            {/* Fila: Fecha y Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  min={hoyStr}
                  {...register("fecha")}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                    errors.fecha
                      ? "border-red-500 bg-red-50"
                      : "border-slate-300"
                  }`}
                />
                {errors.fecha && (
                  <p className="mt-1 text-xs font-semibold text-red-600">
                    ⚠ {errors.fecha.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Hora (Formato 24h)
                </label>
                <input
                  type="text"
                  placeholder="14:30"
                  {...register("hora")}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                    errors.hora
                      ? "border-red-500 bg-red-50"
                      : "border-slate-300"
                  }`}
                />
                {errors.hora && (
                  <p className="mt-1 text-xs font-semibold text-red-600">
                    ⚠ {errors.hora.message}
                  </p>
                )}
              </div>
            </div>

            {/* Selector de Urgencia */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nivel de Urgencia
              </label>
              <select
                {...register("urgencia")}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>

            {/* Motivo */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Motivo de la Consulta
              </label>
              <textarea
                rows={3}
                {...register("motivo")}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                  errors.motivo
                    ? "border-red-500 bg-red-50"
                    : "border-slate-300"
                }`}
                placeholder="Describa brevemente los síntomas..."
              />
              {errors.motivo && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  ⚠ {errors.motivo.message}
                </p>
              )}
            </div>

            {/* Botón Submit Completo */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-md shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed transition-all mt-4"
            >
              {isSubmitting ? (
                <>
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
                  Agendando...
                </>
              ) : (
                "Confirmar y Guardar Cita"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
