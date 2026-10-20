import { Routes, Route, Navigate } from "react-router";
import Layout from "./pages/Layout";
import PaginaDashboard from "./pages/PaginaDashboard";
import PaginaPacientes from "./pages/PaginaPacientes";
import FormularioCita from "./pages/FormularioCita";
import PaginaNotFound from "./pages/PaginaNotFound";
import "./App.css";

function App() {
  return (
    <Routes>
      {/* El Layout envuelve a todas las páginas hijas */}
      <Route element={<Layout />}>
        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Rutas de tu aplicación */}
        <Route path="/dashboard" Component={PaginaDashboard} />
        <Route path="/pacientes" Component={PaginaPacientes} />
        <Route path="/citas" Component={FormularioCita} />
        <Route
          path="/historial"
          element={<div>Página de Historial (Próximamente)</div>}
        />
        {/* CAPTURA CUALQUIER RUTA QUE NO COINCIDA CON LAS DE ARRIBA */}
        <Route path="*" element={<PaginaNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
