interface StatusBadgeProps {
  activo: boolean;
}

export function StatusBadge({ activo }: StatusBadgeProps) {
  const colorStatusBadge: Record<string, string> = {
    true: "text-green-600",
    false: "text-red-600",
  };
  return (
    <div>
      <h6 className={colorStatusBadge[String(activo)]}>
        {activo ? "Sistema Operativo" : "Modo Mantenimiento"}
      </h6>
    </div>
  );
}
