interface SpinnerProps {
  fullscreen?: boolean;
}

export default function SpinnerPaginaPaciente({
  fullscreen = false,
}: SpinnerProps) {
  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-blue-700 animate-pulse">
          La página está cargando...
        </p>
      </div>
    );
  }
  return (
    <div className="inline-block h-4 w-4">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-blue-700 animate-pulse">
        La página está cargando...
      </p>
    </div>
  );
}
