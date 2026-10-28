import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import { Toaster } from "sonner";
import PaginaLogin from "./pages/PaginaLogin";
import PaginaDashboard from "./pages/PaginaDashboard";
import PaginaReportes from "./pages/PaginaReportes";
import PaginaPacientes from "./pages/PaginaPacientes";
import FormularioCita from "./pages/FormularioCita";
import PaginaConsultas from "./pages/PaginaConsultas";
import PaginaDetallePaciente from "./pages/PaginaDetallePaciente";
import PaginaNotFound from "./pages/PaginaNotFound";
import PaginaSinAcceso from "./pages/PaginaSinAcceso.tsx";

import RutaProtegida from "./componets/RutaProtegida";
import MonitorInactividad from "./componets/MonitorInactividad";
import Layout from "./pages/Layout.tsx";

export default function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        {/* 1. RUTAS PÚBLICAS */}
        <Route path="/login" element={<PaginaLogin />} />
        <Route path="/sin-acceso" element={<PaginaSinAcceso />} />

        {/* 2. FILTRO ÚNICO Y CAPA DE DISEÑO (Layout + Monitor) */}
        <Route
          element={
            <MonitorInactividad>
              <Layout />
            </MonitorInactividad>
          }
        >
          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* A. Rutas que CUALQUIER usuario logueado puede ver */}
          <Route element={<RutaProtegida />}>
            <Route path="/dashboard" Component={PaginaDashboard} />
            <Route path="/pacientes" Component={PaginaPacientes} />
            <Route path="/pacientes/:id" Component={PaginaDetallePaciente} />
            <Route path="*" Component={PaginaNotFound} />
          </Route>

          {/* B. Rutas para Recepción */}
          <Route
            element={
              <RutaProtegida rolesPermitidos={["ADMIN", "RECEPCIONISTA"]} />
            }
          >
            <Route path="/citas/nueva" Component={FormularioCita} />
          </Route>

          {/* C. Rutas para Médicos y Gerencia */}
          <Route
            element={
              <RutaProtegida
                rolesPermitidos={["ADMIN", "GERENCIA", "MEDICO"]}
              />
            }
          >
            <Route path="/consultas" Component={PaginaConsultas} />
            <Route
              path="/historial"
              element={<div>Página de Historial (Próximamente)</div>}
            />
          </Route>

          {/* D. Rutas exclusivas de Gerencia */}
          <Route
            element={<RutaProtegida rolesPermitidos={["ADMIN", "GERENCIA"]} />}
          >
            <Route path="/reportes" Component={PaginaReportes} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
