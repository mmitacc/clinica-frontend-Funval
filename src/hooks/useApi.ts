// src/hooks/useApi.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../lib/axios";
import { extraerMensajeError } from "../lib/errorHandler";

interface UseApiResult<T> {
  data: T | null;
  cargando: boolean;
  error: string | null;
  recargar: () => void;
}

export function useApi<T>(
  url: string,
  params?: Record<string, any>,
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState<number>(0);

  // Guardamos los params en un ref para comparar si cambiaron realmente (evita loops)
  const paramsRef = useRef(params);
  useEffect(() => {
    paramsRef.current = params;
  }, [JSON.stringify(params)]);

  const recargar = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    // 1. Crear el controlador de aborto para esta petición específica
    const controller = new AbortController();
    let estaMontado = true;

    const ejecutarPeticion = async () => {
      setCargando(true);
      setError(null);
      try {
        const res = await api.get(url, {
          params: paramsRef.current,
          signal: controller.signal, // <-- Pasamos el token de cancelación a Axios
        });

        if (estaMontado) {
          // Ajustamos según la estructura RespuestaPaginado o RespuestaAPI
          setData(res.data.data !== undefined ? res.data.data : res.data);
          setCargando(false);
        }
      } catch (err: any) {
        // Ignoramos el error si la petición fue cancelada intencionalmente
        if (err.name === "CanceledError" || err.name === "AbortError") {
          return;
        }
        if (estaMontado) {
          setError(extraerMensajeError(err));
          setCargando(false);
        }
      }
    };

    ejecutarPeticion();

    // 2. CLEANUP: Se ejecuta si los params cambian o el componente se desmonta
    return () => {
      estaMontado = false;
      controller.abort(); // Cancelar la petición HTTP en vuelo inmediatamente
    };
  }, [url, version, JSON.stringify(params)]);

  return { data, cargando, error, recargar };
}
