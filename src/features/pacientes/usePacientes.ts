import { useEffect } from "react";
import { usePacientesStore } from "../../stores/pacientesStore";

export function usePacientes() {
  // 1. Selección del estado
  const pacientes = usePacientesStore((state) => state.pacientes);
  const cargando = usePacientesStore((state) => state.cargando);
  const error = usePacientesStore((state) => state.error);

  // 2. Selección de acciones (métodos de la API de Zustand)
  const cargar = usePacientesStore((state) => state.cargar);
  const crear = usePacientesStore((state) => state.crear);
  const actualizar = usePacientesStore((state) => state.actualizar);
  const eliminar = usePacientesStore((state) => state.eliminar);

  // 3. Carga inicial automática (Efecto secundario)
  useEffect(() => {
    cargar();
  }, [cargar]);

  // 4. Retorno de una API limpia y unificada para el componente
  return {
    pacientes,
    cargando,
    error,
    crear,
    actualizar,
    eliminar,
    refrescar: cargar, // Opcional: expone la recarga manual con un nombre semántico
  };
}
