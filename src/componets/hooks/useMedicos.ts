import { useState, useEffect } from "react";
import dataMedicos from "../../data/medicos.json";
import type { Medico } from "../../types/medico";

export default function useMedicos() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setMedicos(dataMedicos as Medico[]);
      setCargando(false);
    }, 800);

    return () => clearTimeout(timer); // cancela el timer si el componente se desmonta antes
  }, []);
  return { medicos, cargando };
}
