interface Props {
  limitePorPagina: number;
}

export default function SkeletonPaginaConsultas({ limitePorPagina }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            <th className="p-4">ID</th>
            <th className="p-4">Paciente</th>
            <th className="p-4">Fecha Cita</th>
            <th className="p-4">Estado Clínico</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {/* Generamos 5 filas de esqueleto ficticias animadas */}
          {Array.from({ length: limitePorPagina }).map((_, index) => (
            <tr key={index} className="animate-pulse">
              <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </td>
              <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-36"></div>
              </td>
              <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </td>
              <td className="p-4">
                <div className="h-6 bg-gray-200 rounded-full w-24"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
