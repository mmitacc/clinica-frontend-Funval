import { useEffect, useState, useMemo } from "react";
import { api } from "../lib/axios";
import { extraerMensajeError } from "../lib/errorHandler";
import { GraficaCitaEspecialidad } from "../componets/GraficasCitasEspecialidad";
import type { Consulta } from "../types/consulta";

interface ReporteEspecialidad {
  especialidad: string;
  total: number;
}

export default function PaginaReportes() {
  const [especialidades, setEspecialidades] = useState<ReporteEspecialidad[]>(
    [],
  );
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Efecto para obtener la data real de la API
  useEffect(() => {
    let unmounted = false;

    const cargarMetricas = async () => {
      try {
        setCargando(true);
        setError(null);

        const [resEspecialidades, resConsultas] = await Promise.all([
          api.get("/especialidades/reportes"),
          api.get("/consultas"),
        ]);

        if (!unmounted) {
          const dataEsp =
            resEspecialidades.data.data.data || resEspecialidades.data;
          const dataCons = resConsultas.data.data || resConsultas.data;

          setEspecialidades(Array.isArray(dataEsp) ? dataEsp : []);
          setConsultas(Array.isArray(dataCons) ? dataCons : []);
        }
      } catch (err) {
        if (!unmounted) {
          setError(extraerMensajeError(err));
        }
      } finally {
        if (!unmounted) {
          setCargando(false);
        }
      }
    };

    cargarMetricas();
    return () => {
      unmounted = true;
    };
  }, []);

  // 2. Transformación local del arreglo de consultas para el LineChart
  const datosCitasPorDia = useMemo(() => {
    if (!consultas.length) return [];

    const conteoFechas: Record<string, number> = {};

    consultas.forEach((cita) => {
      if (cita.fecha) {
        const soloFecha = cita.fecha.split("T")[0]; // Asegura el parseo limpio YYYY-MM-DD
        conteoFechas[soloFecha] = (conteoFechas[soloFecha] || 0) + 1;
      }
    });

    return Object.entries(conteoFechas)
      .map(([fecha, total]) => ({ fecha, total }))
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
      .slice(-7);
  }, [consultas]);

  // RENDER: SKELETON DE CARGA (Tailwind pulse)
  if (cargando) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 animate-pulse"
            >
              <div className="h-5 bg-slate-200 rounded w-1/3"></div>
              <div className="h-[280px] bg-slate-100 rounded-lg flex items-end justify-between p-4 space-x-2">
                <div className="w-full bg-slate-200 rounded-t h-[40%]"></div>
                <div className="w-full bg-slate-200 rounded-t h-[75%]"></div>
                <div className="w-full bg-slate-200 rounded-t h-[20%]"></div>
                <div className="w-full bg-slate-200 rounded-t h-[60%]"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // RENDER: MANEJO DE ERRORES HTTP
  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm shadow-sm">
          ⚠️ Ocurrió un error al procesar las gráficas: {error}
        </div>
      </div>
    );
  }

  // RENDER: PÁGINA FINAL CON INYECCIÓN DE PROPS
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Panel de Reportes y Estadísticas
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitoreo analítico del rendimiento de consultas médicas.
        </p>
      </div>

      {/* Aquí inyectamos el componente visual pasándole los datos calculados */}
      <GraficaCitaEspecialidad
        especialidades={especialidades}
        flujoDias={datosCitasPorDia}
      />
    </div>
  );
}
