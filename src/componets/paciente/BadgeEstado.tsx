import type { EstadoPaciente } from "../../types/paciente";

interface BadgeEstadoProps {
  estado: EstadoPaciente;
  texto: string;
}

export function BadgeEstado({ estado, texto }: BadgeEstadoProps) {
  const colorStatusBadge: Record<string, string> = {
    activo: "text-green-500",
    inactivo: "text-gray-400",
    en_espera: "text-amber-500",
  };
  return (
    <div>
      <h6 className={colorStatusBadge[estado]}>{texto}</h6>
    </div>
  );
}
