import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { citaService } from '../../services/citaService';
import { Link } from 'react-router-dom';

const DashboardDoctor = () => {
  const { user, logout } = useAuth();

  const [agenda, setAgenda] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    pendientes: 0,
    confirmadas: 0,
    completadas: 0
  });

  useEffect(() => {
    cargarAgenda();
  }, []);

  const cargarAgenda = async () => {
    try {
      const response = await citaService.getDoctorAgenda();

      const citas = response.data;

      setAgenda(citas);

      setEstadisticas({
        total: citas.length,
        pendientes: citas.filter(c => c.status === 'pendiente').length,
        confirmadas: citas.filter(c => c.status === 'confirmada').length,
        completadas: citas.filter(c => c.status === 'completada').length
      });

    } catch (error) {
      console.error(error);
      setAgenda([]);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              Portal del Doctor
            </h1>

            <p className="text-gray-600">
              Bienvenido, {user?.name}
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Cerrar sesión
          </button>

        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">

          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-gray-500 text-sm">
              Total Citas
            </h3>

            <p className="text-3xl font-bold mt-2">
              {estadisticas.total}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-gray-500 text-sm">
              Pendientes
            </h3>

            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {estadisticas.pendientes}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-gray-500 text-sm">
              Confirmadas
            </h3>

            <p className="text-3xl font-bold text-blue-600 mt-2">
              {estadisticas.confirmadas}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-gray-500 text-sm">
              Completadas
            </h3>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {estadisticas.completadas}
            </p>
          </div>

        </div>

        {/* Agenda */}
        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Agenda Médica
          </h2>

          {agenda.length === 0 ? (
            <p className="text-gray-500">
              No hay citas registradas.
            </p>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-3 text-left">Paciente</th>
                    <th className="p-3 text-left">Fecha</th>
                    <th className="p-3 text-left">Hora</th>
                    <th className="p-3 text-left">Motivo</th>
                    <th className="p-3 text-left">Estado</th>
                    <th className="p-3 text-left">Acción</th>
                  </tr>
                </thead>

                <tbody>

                  {agenda.map((cita) => (

                    <tr
                      key={cita._id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-3">
                        {cita.patientId?.name}
                      </td>

                      <td className="p-3">
                        {cita.date}
                      </td>

                      <td className="p-3">
                        {cita.startTime}
                      </td>

                      <td className="p-3">
                        {cita.reason}
                      </td>

                      <td className="p-3">
                        {cita.status}
                      </td>

                      <td className="p-3">
                        <Link
                          to={`/doctor/cita/${cita._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Ver detalle
                        </Link>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

    </main>
  );
};

export default DashboardDoctor;