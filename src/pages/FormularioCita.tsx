import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { citaSchema } from "../schemas/citaSchema";
import type { CitaFormData } from "../schemas/citaSchema";
import useMedicos from "../componets/hooks/useMedicos";
import usePacientes from "../componets/hooks/usePacientes";
import { useCitasStore } from "../stores/useCitasStore";

// Extendemos o aseguramos de que el tipo del formulario contenga el costo
interface FormularioCitaData extends CitaFormData {
  costo: number;
}

export default function FormularioCita() {
  const { medicos, cargando: cargandoMedicos } = useMedicos();
  const { pacientes, cargando: cargandoPacientes } = usePacientes();
  const [citaExitosa, setCitaExitosa] = useState<FormularioCitaData | null>(
    null,
  );

  const agregarCita = useCitasStore((state) => state.agregarCita);
  const errorStore = useCitasStore((state) => state.error);
  const cargandoStore = useCitasStore((state) => state.cargando);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormularioCitaData>({
    resolver: zodResolver(citaSchema),
    defaultValues: {
      pacienteId: "",
      medicoId: "",
      fecha: "",
      hora: "",
      motivo: "",
      urgencia: "baja",
      costo: 50.0,
    },
  });

  const onSubmit = async (data: FormularioCitaData) => {
    try {
      await agregarCita({
        id_paciente: Number(data.pacienteId),
        id_usuario: Number(data.medicoId),
        estado: "PROGRAMADA",
        costo: data.costo,
        motivo: data.motivo,
        fecha: data.fecha,
        horario: data.hora,
      });

      setCitaExitosa(data);
    } catch (err) {
      console.error("Error al registrar la cita:", err);
    }
  };

  const manejarNuevaCita = () => {
    setCitaExitosa(null);
    reset();
  };

  const hoyStr = new Date().toLocaleDateString("en-CA");

  // PANTALLA DE CONFIRMACIÓN (ÉXITO)
  if (citaExitosa) {
    const medicoSeleccionado = medicos.find(
      (m) => String(m.id) === String(citaExitosa.medicoId),
    );
    const pacienteSeleccionado = pacientes.find(
      (p) => String(p.id) === String(citaExitosa.pacienteId),
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
          El registro se completó correctamente bajo el estado{" "}
          <strong>PROGRAMADA</strong>.
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
              ? `Dr(a). ${medicoSeleccionado.nombres} ${medicoSeleccionado.apellidos}`
              : "No asignado"}
          </p>
          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
            <p className="text-sm text-slate-600">
              <strong className="text-slate-800">Fecha:</strong>{" "}
              {citaExitosa.fecha}
            </p>
            <p className="text-sm text-slate-600">
              <strong className="text-slate-800">Horario:</strong>{" "}
              {citaExitosa.hora} hrs
            </p>
          </div>
          <p className="text-sm text-slate-600">
            <strong className="text-slate-800">Costo total:</strong> S/.{" "}
            {citaExitosa.costo}
          </p>
          <p className="text-sm text-slate-600 capitalize">
            <strong className="text-slate-800">Urgencia:</strong>{" "}
            {citaExitosa.urgencia}
          </p>
          <p className="text-sm text-slate-600 border-t border-slate-100 pt-3">
            <strong className="text-slate-800">Motivo de Formulario:</strong>{" "}
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

  // RENDER DEL FORMULARIO DE ENTRADA
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow border border-gray-200 space-y-5"
    >
      <h2 className="text-xl font-bold text-gray-800 border-b pb-3">
        Agendar Nueva Consulta
      </h2>

      {errorStore && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
          ⚠️ {errorStore}
        </div>
      )}

      {/* Select Paciente */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
          Paciente
        </label>
        <select
          {...register("pacienteId")}
          disabled={cargandoPacientes}
          className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none disabled:opacity-50"
        >
          <option value="">Seleccione un paciente</option>
          {pacientes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombres} {p.apellidos}
            </option>
          ))}
        </select>
        {errors.pacienteId && (
          <p className="text-xs text-red-600 mt-1">
            {errors.pacienteId.message}
          </p>
        )}
      </div>

      {/* Select Médico */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
          Médico Especialista
        </label>
        <select
          {...register("medicoId")}
          disabled={cargandoMedicos}
          className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none disabled:opacity-50"
        >
          <option value="">Seleccione un médico</option>
          {medicos.map((m) => (
            <option key={m.id} value={m.id}>
              Dr(a). {m.nombres} {m.apellidos}
            </option>
          ))}
        </select>
        {errors.medicoId && (
          <p className="text-xs text-red-600 mt-1">{errors.medicoId.message}</p>
        )}
      </div>

      {/* Fecha y Hora */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Fecha
          </label>
          <input
            type="date"
            min={hoyStr}
            {...register("fecha")}
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
          />
          {errors.fecha && (
            <p className="text-xs text-red-600 mt-1">{errors.fecha.message}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Hora (Horario)
          </label>
          <input
            type="time"
            {...register("hora")}
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
          />
          {errors.hora && (
            <p className="text-xs text-red-600 mt-1">{errors.hora.message}</p>
          )}
        </div>
      </div>

      {/* [NUEVO] Campo de Costo de Consulta */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
          Costo de Consulta (S/.)
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          {...register("costo")}
          className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="50.0"
        />
        {errors.costo && (
          <p className="text-xs text-red-600 mt-1">{errors.costo.message}</p>
        )}
      </div>

      {/* Nivel de Urgencia (Visual para Hook Form) */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
          Nivel de Urgencia
        </label>
        <div className="flex gap-4 mt-1">
          {["baja", "media", "alta"].map((nivel) => (
            <label
              key={nivel}
              className="flex items-center gap-2 text-sm text-gray-700 capitalize cursor-pointer"
            >
              <input
                type="radio"
                value={nivel}
                {...register("urgencia")}
                className="text-blue-600 focus:ring-blue-500"
              />
              {nivel}
            </label>
          ))}
        </div>
      </div>

      {/* Motivo de la Cita */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
          Motivo / Síntomas
        </label>
        <textarea
          rows={3}
          {...register("motivo")}
          placeholder="Escriba el motivo..."
          className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none placeholder:text-gray-400"
        />
        {errors.motivo && (
          <p className="text-xs text-red-600 mt-1">{errors.motivo.message}</p>
        )}
      </div>

      {/* Botón de Envío */}
      <button
        type="submit"
        disabled={cargandoStore}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm shadow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {cargandoStore ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Guardando cita...
          </>
        ) : (
          "Confirmar y Agendar Cita"
        )}
      </button>
    </form>
  );
}
