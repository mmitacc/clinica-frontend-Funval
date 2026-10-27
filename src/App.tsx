import { Routes, Route, Navigate } from "react-router";
import Layout from "./pages/Layout";
import PaginaDashboard from "./pages/PaginaDashboard";
import PaginaPacientes from "./pages/PaginaPacientes";
import FormularioCita from "./pages/FormularioCita";
import PaginaNotFound from "./pages/PaginaNotFound";
import "./App.css";
import { PaginaDetallePaciente } from "./pages/PaginaDetallePaciente";
import { PaginaConsultas } from "./pages/PaginaConsultas";
import { Toaster } from "sonner";
import { PaginaReportes } from "./pages/PaginaReportes";
import PaginaLogin from "./pages/PaginaLogin";
import RutaProtegida from "./componets/RutaProtegida";
import MonitorInactividad from "./componets/MonitorInactividad";

function App() {
  return (
    <>
      {" "}
      <Toaster richColors position="top-right" />
      <Routes>
        {/* 1. RUTA PÚBLICA: Fuera del Layout de la clínica */}
        <Route path="/login" element={<PaginaLogin />} />

        {/* 2. RUTAS PROTEGIDAS Y MONITOREADAS */}
        <Route
          element={
            <RutaProtegida>
              <MonitorInactividad>
                <Layout />
              </MonitorInactividad>
            </RutaProtegida>
          }
        >
          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Rutas de tu aplicación */}
          <Route path="/dashboard" Component={PaginaDashboard} />
          <Route path="/reportes" Component={PaginaReportes} />
          <Route path="/pacientes" Component={PaginaPacientes} />
          <Route path="/citas/nueva" Component={FormularioCita} />
          <Route path="/consultas" Component={PaginaConsultas} />
          <Route
            path="/historial"
            element={<div>Página de Historial (Próximamente)</div>}
          />
          <Route path="/pacientes/:id" Component={PaginaDetallePaciente} />
          {/* Captura cualquier ruta interna inválida */}
          <Route path="*" element={<PaginaNotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
