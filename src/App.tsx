import { Routes, Route, Navigate } from "react-router";
import Layout from "./pages/Layout";
import PaginaDashboard from "./pages/PaginaDashboard";
import PaginaPacientes from "./pages/PaginaPacientes";
import FormularioCita from "./pages/FormularioCita";
import PaginaNotFound from "./pages/PaginaNotFound";
import "./App.css";
import { PaginaDetallePaciente } from "./pages/PaginaDetallePaciente";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      {" "}
      <Toaster richColors position="top-right" />
      <Routes>
        {/* El Layout envuelve a todas las páginas hijas */}
        <Route element={<Layout />}>
          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Rutas de tu aplicación */}
          <Route path="/dashboard" Component={PaginaDashboard} />
          <Route path="/pacientes" Component={PaginaPacientes} />
          <Route path="/citas/nueva" Component={FormularioCita} />
          <Route
            path="/historial"
            element={<div>Página de Historial (Próximamente)</div>}
          />
          <Route path="/pacientes/:id" Component={PaginaDetallePaciente} />
          {/* CAPTURA CUALQUIER RUTA QUE NO COINCIDA CON LAS DE ARRIBA */}
          <Route path="*" element={<PaginaNotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
