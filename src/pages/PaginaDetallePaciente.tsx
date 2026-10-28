import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { api } from "../lib/axios";
import type { Paciente } from "../types/paciente";
import PaginaNotFound from "./PaginaNotFound";

export default function PaginaDetallePaciente() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    const obtenerDetallePaciente = async () => {
      setCargando(true);
      setError(false);
      try {
        const res = await api.get(`/pacientes/${id}`);
        setPaciente(res.data.data || res.data);
      } catch (err) {
        console.error("Error al cargar detalle del paciente:", err);
        setError(true);
      } finally {
        setCargando(false);
      }
    };
    obtenerDetallePaciente();
  }, [id]);

  console.log("PACIENTE: ", paciente);

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-6 space-y-4">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-blue-700 animate-pulse">
          Cargando historial del paciente...
        </p>
      </div>
    );
  }

  // Si no se encuentra el paciente o la API da error, renderizamos el componente 404
  if (error || !paciente) {
    return <PaginaNotFound />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6 animate-in fade-in duration-200">
      {/* Botón Volver Atrás programático */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs"
      >
        ← Volver
      </button>

      {/* Ficha Médica del Paciente */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <header className="p-6 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold bg-gradient-to-br ${paciente.masculino ? "from-blue-500 to-blue-600 text-white" : "from-pink-500 to-pink-600 text-white"}`}
            >
              {paciente.nombres.charAt(0)}
              {paciente.apellidos.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {paciente.nombres} {paciente.apellidos}
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                ID de Registro: {paciente.id}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-center uppercase ${paciente.estado === "ACTIVO" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}
          >
            {paciente.estado || "Activo"}
          </span>
        </header>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información Personal */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">
              Información Personal
            </h2>
            <div className="bg-slate-50/60 p-4 rounded-xl space-y-3 border border-slate-100 text-sm">
              <p>
                <span className="text-slate-400">Género:</span>{" "}
                <span className="font-medium text-slate-800">
                  {paciente.masculino ? "Masculino" : "Femenino"}
                </span>
              </p>
              <p>
                <span className="text-slate-400">Fecha Nacimiento:</span>{" "}
                <span className="font-medium text-slate-800">
                  {new Date(paciente.fechanacimiento).toLocaleDateString()}
                </span>
              </p>
              <p>
                <span className="text-slate-400">Teléfono:</span>{" "}
                <span className="font-mono font-medium text-slate-800">
                  {paciente.telefono}
                </span>
              </p>
              <p>
                <span className="text-slate-400">Email:</span>{" "}
                <span className="font-medium text-slate-800">
                  {paciente.email}
                </span>
              </p>
            </div>
          </section>

          {/* Información Médica */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">
              Ficha Clínica
            </h2>
            <div className="bg-slate-50/60 p-4 rounded-xl space-y-3 border border-slate-100 text-sm">
              <p>
                <span className="text-slate-400">Tipo de Sangre:</span>{" "}
                <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded-md font-bold text-xs">
                  {paciente.tiposangre}
                </span>
              </p>
              <p>
                <span className="text-slate-400">Alergias:</span>{" "}
                <span className="font-medium text-red-600">
                  {paciente.alergias || "Ninguna"}
                </span>
              </p>
              <p>
                <span className="text-slate-400">Especialidad:</span>{" "}
                <span className="font-medium text-slate-800">
                  {paciente.especialidadAsignada || "General"}
                </span>
              </p>
              <p>
                <span className="text-slate-400">Última Cita:</span>{" "}
                <span className="font-medium text-slate-800">
                  {paciente.ultimaCita || "Sin registros"}
                </span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
