import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import DashboardPaciente from './pages/paciente/DashboardPaciente';
import AgendarCita from './pages/paciente/citas/AgendarCita';
import MisCitas from './pages/paciente/citas/MisCitas';
import HistorialCitas from './pages/paciente/citas/HistorialCitas';
import EditarCita from './pages/paciente/citas/EditarCita';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import GestionDoctores from './pages/admin/GestionDoctores';
import GestionHorarios from './pages/admin/GestionHorarios';
import GestionConsultorios from './pages/admin/GestionConsultorios';
import Estadisticas from './pages/admin/Estadisticas';
import DashboardDoctor from './pages/doctor/DashboardDoctor';
import DetalleCita from './pages/doctor/DetalleCita';

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
                <AgendarCita />
              </ProtectedRoute>
            }
          />

          <Route
            path="/paciente/citas"
            element={
              <ProtectedRoute allowedRoles={["paciente"]}>
                <MisCitas />
              </ProtectedRoute>
            }
          />

          <Route
            path="/paciente/citas/historial"
            element={
              <ProtectedRoute allowedRoles={["paciente"]}>
                <HistorialCitas />
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
            path="/admin/doctores"
            element={
              <ProtectedRoute allowedRoles={["administrador"]}>
                <GestionDoctores />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/horarios"
            element={
              <ProtectedRoute allowedRoles={["administrador"]}>
                <GestionHorarios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/consultorios"
            element={
              <ProtectedRoute allowedRoles={["administrador"]}>
                <GestionConsultorios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/estadisticas"
            element={
              <ProtectedRoute allowedRoles={["administrador"]}>
                <Estadisticas />
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
            path="/doctor/cita/:id"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DetalleCita />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["administrador"]}>
                <DashboardAdmin />
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
