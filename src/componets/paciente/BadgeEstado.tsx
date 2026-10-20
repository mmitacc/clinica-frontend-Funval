import type { EstadoPaciente } from "../../types/paciente";

interface BadgeEstadoProps {
  estado: EstadoPaciente;
  texto: string;
}

export function BadgeEstado({ estado, texto }: BadgeEstadoProps) {
  const colorStatusBadge: Record<string, string> = {
    ACTIVO: "text-green-500",
    INACTIVO: "text-gray-400",
    EN_ESPERA: "text-amber-500",
  };
  return (
    <div>
      <h6 className={colorStatusBadge[estado]}>{texto}</h6>
    </div>
  );
}
