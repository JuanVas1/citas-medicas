import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { citaService } from '../../services/citaService';
import { horarioService } from '../../services/horarioService';
import { Link } from 'react-router-dom';

const DashboardAdmin = () => {
  const { user, logout } = useAuth();

  const [citas, setCitas] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    pendientes: 0,
    confirmadas: 0,
    completadas: 0,
    canceladas: 0,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const response = await citaService.getAll();

      const data = response.data;

      setCitas(data);

      setEstadisticas({
        total: data.length,
        pendientes: data.filter((c) => c.status === 'pendiente').length,
        confirmadas: data.filter((c) => c.status === 'confirmada').length,
        completadas: data.filter((c) => c.status === 'completada').length,
        canceladas: data.filter((c) => c.status === 'cancelada').length,
      });
    } catch (error) {
      console.error(error);
      setCitas([]);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Panel del Administrador
            </h1>

            <p className="text-gray-600 mt-1">
              Bienvenido, {user?.name}
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid gap-4 md:grid-cols-5 mb-8">

          <div className="rounded-xl bg-white p-5 shadow">
            <h3 className="text-sm text-gray-500">
              Total Citas
            </h3>
            <p className="mt-2 text-3xl font-bold">
              {estadisticas.total}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <h3 className="text-sm text-gray-500">
              Pendientes
            </h3>
            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {estadisticas.pendientes}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <h3 className="text-sm text-gray-500">
              Confirmadas
            </h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {estadisticas.confirmadas}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <h3 className="text-sm text-gray-500">
              Completadas
            </h3>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {estadisticas.completadas}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <h3 className="text-sm text-gray-500">
              Canceladas
            </h3>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {estadisticas.canceladas}
            </p>
          </div>

        </div>

        {/* Acciones rápidas */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">

          <Link
            to="/admin/doctores"
            className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition"
          >
            <h3 className="font-semibold text-lg">
              Gestionar Doctores
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Registrar, editar y administrar doctores.
            </p>
          </Link>

          <Link
            to="/admin/horarios"
            className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition"
          >
            <h3 className="font-semibold text-lg">
              Gestionar Horarios
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Administrar disponibilidad médica.
            </p>
          </Link>

          <Link
            to="/admin/estadisticas"
            className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition"
          >
            <h3 className="font-semibold text-lg">
              Ver Estadísticas
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Consultar métricas del sistema.
            </p>
          </Link>

        </div>

        {/* Tabla de citas */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Citas Registradas
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">

              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3 text-left">Paciente</th>
                  <th className="p-3 text-left">Fecha</th>
                  <th className="p-3 text-left">Hora</th>
                  <th className="p-3 text-left">Estado</th>
                </tr>
              </thead>

              <tbody>
                {citas.map((cita) => (
                  <tr
                    key={cita._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">
                      {cita.patientId?.name || 'Paciente'}
                    </td>

                    <td className="p-3">
                      {cita.date}
                    </td>

                    <td className="p-3">
                      {cita.startTime}
                    </td>

                    <td className="p-3">
                      {cita.status}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </main>
  );
};

export default DashboardAdmin;