import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";

interface Props {
  children: React.ReactNode;
}

export default function RutaProtegida({ children }: Props) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  // Si el médico o administrador NO está autenticado, lo mandamos al Login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado, permitimos el acceso a las páginas hijas (Layout/Dashboard...)
  return <>{children}</>;
}
