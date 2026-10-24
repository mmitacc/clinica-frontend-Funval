import { useState, useEffect } from "react";
import { api } from "../../lib/axios";
import { extraerMensajeError } from "../../lib/errorHandler";
import type { Paciente } from "../../types/paciente";

export default function usePacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unmounted = false; // Control de limpieza para evitar fugas de memoria al desmontar

    const obtenerPacientes = async () => {
      try {
        setCargando(true);
        setError(null);

        // Petición HTTP real a tu API de Axios
        const res = await api.get("/pacientes");

        if (!unmounted) {
          // Extrae los datos considerando si tu Backend los envuelve en un objeto 'data'
          const dataFinal = res.data.data || res.data;
          setPacientes(dataFinal);
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

    obtenerPacientes();

    // CLEANUP: Evita actualizar el estado si el componente se desmonta mientras la petición vuela
    return () => {
      unmounted = true;
    };
  }, []);

  // Retornamos las variables reactivas junto con el estado del error
  return { pacientes, cargando, error };
}
