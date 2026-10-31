import { useEffect, useState, useMemo } from "react";
import { api } from "../lib/axios";
import { extraerMensajeError } from "../lib/errorHandler";
import { GraficaCitaEspecialidad } from "../componets/GraficasCitasEspecialidad";
import type { Consulta } from "../types/consulta";
import EncabezadoPagina from "../componets/EncabezadoPagina";
import SkeletonPaginaReportes from "../componets/ui/SkeletonPaginaReportes";

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
      <EncabezadoPagina
        titulo="Panel de Reportes y Estadísticas"
        descripcion="Monitoreo analítico del rendimiento de consultas médicas"
      />

      {/* Aquí inyectamos el componente visual pasándole los datos calculados */}
      {cargando ? (
        <SkeletonPaginaReportes />
      ) : (
        <GraficaCitaEspecialidad
          especialidades={especialidades}
          flujoDias={datosCitasPorDia}
        />
      )}
    </div>
  );
}
