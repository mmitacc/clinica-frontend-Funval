import { useEffect, useMemo } from "react";
import { useCitasStore } from "../../stores/useCitasStore";

export function useCitas() {
  // 1. Selección del estado crudo desde el store
  const storeCitas = useCitasStore((state) => state.citas);
  const cargando = useCitasStore((state) => state.cargando);
  const error = useCitasStore((state) => state.error);

  // 2. Selección de acciones
  const cargar = useCitasStore((state) => state.cargarTodas);
  const crear = useCitasStore((state) => state.agregarCita);
  const actualizar = useCitasStore((state) => state.actualizarCita);
  const eliminar = useCitasStore((state) => state.eliminarCita);

  // 3. Carga inicial automática
  useEffect(() => {
    cargar();
  }, [cargar]);

  // 4. NORMALIZACIÓN DEFENSIVA: Garantizamos un Array iterable pase lo que pase
  const citas = useMemo(() => {
    if (!storeCitas) return [];
    if (Array.isArray(storeCitas)) return storeCitas;
    if (
      typeof storeCitas === "object" &&
      "data" in storeCitas &&
      Array.isArray((storeCitas as any).data)
    ) {
      return (storeCitas as any).data;
    }
    return [];
  }, [storeCitas]);

  // 5. Retorno unificado
  return {
    citas, // <-- Ahora es 100% seguro y garantizado como Array []
    cargando,
    error,
    crear,
    actualizar,
    eliminar,
    refrescar: cargar,
  };
}
