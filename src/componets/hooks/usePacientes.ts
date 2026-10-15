import { useState, useEffect } from "react";
// 1. Importamos los datos locales y la interfaz de TypeScript
import dataPacientes from "../../data/pacientes.json";

export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  especialidadAsignada: string;
  ultimaCita: string;
  estado: string;
}

export default function usePacientes() {
  // 2. Definimos los estados para los datos y el indicador de carga
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    // 3. Simulamos una latencia de red de 600ms para la carga de datos
    const timer = setTimeout(() => {
      setPacientes(dataPacientes as Paciente[]);
      setCargando(false);
    }, 600);

    // 4. CLEANUP: Cancela el temporizador si el componente se desmonta antes de tiempo
    return () => {
      clearTimeout(timer);
    };
  }, []); // Solo se ejecuta al montar el componente

  // 5. Retornamos las variables reactivas para el formulario
  return { pacientes, cargando };
}
