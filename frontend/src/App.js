import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import DashboardPaciente from './pages/paciente/DashboardPaciente';
import EditarCita from './pages/paciente/citas/EditarCita';
import DashboardDoctor from './pages/doctor/DashboardDoctor';
import DetalleCita from './pages/doctor/DetalleCita';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import GestionDoctores from './pages/admin/GestionDoctores';
import GestionHorarios from './pages/admin/GestionHorarios';
import Estadisticas from './pages/admin/Estadisticas';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/paciente"
            element={
              <ProtectedRoute allowedRoles={["paciente"]}>
                <DashboardPaciente />
              </ProtectedRoute>
            }
          />

          <Route
            path="/paciente/citas/agendar"
            element={
              <ProtectedRoute allowedRoles={["paciente"]}>
                <DashboardPaciente />
              </ProtectedRoute>
            }
          />

          <Route
            path="/paciente/citas"
            element={
              <ProtectedRoute allowedRoles={["paciente"]}>
                <DashboardPaciente />
              </ProtectedRoute>
            }
          />

          <Route
            path="/paciente/citas/historial"
            element={
              <ProtectedRoute allowedRoles={["paciente"]}>
                <DashboardPaciente />
              </ProtectedRoute>
            }
          />

          <Route
            path="/paciente/citas/editar/:id"
            element={
              <ProtectedRoute allowedRoles={["paciente"]}>
                <EditarCita />
              </ProtectedRoute>
            }
          />

          <Route
            path="/paciente/doctores"
            element={
              <ProtectedRoute allowedRoles={["paciente"]}>
                <DashboardPaciente />
              </ProtectedRoute>
            }
          />

          <Route
            path="/paciente/perfil"
            element={
              <ProtectedRoute allowedRoles={["paciente"]}>
                <DashboardPaciente />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DashboardDoctor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/agenda"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DashboardDoctor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/perfil"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DashboardDoctor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/cita/:id"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DetalleCita />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/doctores"
            element={
              <ProtectedRoute allowedRoles={["administrador"]}>
                <DashboardAdmin initialTab="doctores" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/citas"
            element={
              <ProtectedRoute allowedRoles={["administrador"]}>
                <DashboardAdmin initialTab="citas" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pacientes"
            element={
              <ProtectedRoute allowedRoles={["administrador"]}>
                <DashboardAdmin initialTab="pacientes" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <ProtectedRoute allowedRoles={["administrador"]}>
                <DashboardAdmin initialTab="usuarios" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/horarios"
            element={
              <ProtectedRoute allowedRoles={["administrador"]}>
                <DashboardAdmin initialTab="horarios" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/estadisticas"
            element={
              <ProtectedRoute allowedRoles={["administrador"]}>
                <DashboardAdmin initialTab="estadisticas" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/especialidades"
            element={
              <ProtectedRoute allowedRoles={["administrador"]}>
                <DashboardAdmin initialTab="especialidades" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/facturacion"
            element={
              <ProtectedRoute allowedRoles={["administrador"]}>
                <DashboardAdmin initialTab="facturacion" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["administrador"]}>
                <DashboardAdmin initialTab="dashboard" />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
