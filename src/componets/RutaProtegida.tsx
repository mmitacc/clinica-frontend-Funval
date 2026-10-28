import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";

interface RutaProtegidaProps {
  rolesPermitidos?: string[];
}

export default function RutaProtegida({ rolesPermitidos }: RutaProtegidaProps) {
  const { isAuthenticated, usuario } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (rolesPermitidos && !rolesPermitidos.includes(usuario!.role)) {
    return <Navigate to="/sin-acceso" replace />;
  }
  return <Outlet />;
}
