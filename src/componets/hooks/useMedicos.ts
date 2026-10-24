import { useState, useEffect } from "react";
import { api } from "../../lib/axios";
import { extraerMensajeError } from "../../lib/errorHandler";
import type { Usuario } from "../../types/usuario";

export default function useMedicos() {
  const [medicos, setMedicos] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Añadido soporte para capturar errores HTTP

  useEffect(() => {
    let unmounted = false; // Control de limpieza para evitar fugas de memoria al desmontar

    const obtenerMedicos = async () => {
      try {
        setCargando(true);
        setError(null);

        // Petición HTTP real a tu API.
        const res = await api.get("/usuarios");

        if (!unmounted) {
          const dataFinal = res.data.data || res.data;

          // Si el endpoint trae todos los usuarios de la app, podemos filtrar aquí solo los que tengan rol MEDICO
          const soloMedicos = Array.isArray(dataFinal)
            ? dataFinal.filter((u: Usuario) => u.role === "MEDICO")
            : dataFinal;

          setMedicos(soloMedicos);
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

    obtenerMedicos();

    return () => {
      unmounted = true;
    };
  }, []);

  return { medicos, cargando, error };
}
