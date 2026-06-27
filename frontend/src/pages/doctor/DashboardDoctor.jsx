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

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await citaService.updateStatus(id, { status: nuevoEstado });
      cargarAgenda(); // refresca la tabla
    } catch (error) {
      alert(error.response?.data?.error || 'Error al cambiar estado');
    }
  };

  const getBadge = (status) => {
    const map = {
      pendiente:  'bg-yellow-100 text-yellow-800',
      confirmada: 'bg-blue-100 text-blue-800',
      completada: 'bg-green-100 text-green-800',
      cancelada:  'bg-red-100 text-red-800',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Portal del Doctor</h1>
            <p className="text-gray-600">Bienvenido, {user?.name}</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-gray-500 text-sm">Total Citas</h3>
            <p className="text-3xl font-bold mt-2">{estadisticas.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-gray-500 text-sm">Pendientes</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{estadisticas.pendientes}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-gray-500 text-sm">Confirmadas</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{estadisticas.confirmadas}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-gray-500 text-sm">Completadas</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{estadisticas.completadas}</p>
          </div>
        </div>

        {/* Agenda */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Agenda Médica</h2>

          {agenda.length === 0 ? (
            <p className="text-gray-500 py-8 text-center">No hay citas registradas aún.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Paciente</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Fecha</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Hora</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Motivo</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Estado</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {agenda.map((cita) => (
                    <tr key={cita._id} className="border-b hover:bg-gray-50 transition">

                      <td className="p-3 font-medium text-gray-900">
                        {cita.patientId?.name || '—'}
                      </td>

                      <td className="p-3 text-gray-600">{cita.date}</td>

                      <td className="p-3 text-gray-600">
                        {cita.startTime} – {cita.endTime}
                      </td>

                      <td className="p-3 text-gray-600 max-w-xs truncate">
                        {cita.reason}
                      </td>

                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getBadge(cita.status)}`}>
                          {cita.status}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-2 flex-wrap">

                          {/* Botón Confirmar: solo si está pendiente */}
                          {cita.status === 'pendiente' && (
                            <button
                              onClick={() => handleCambiarEstado(cita._id, 'confirmada')}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                            >
                              Confirmar
                            </button>
                          )}

                          {/* Botón Completar: solo si está confirmada */}
                          {cita.status === 'confirmada' && (
                            <button
                              onClick={() => handleCambiarEstado(cita._id, 'completada')}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                            >
                              Completar
                            </button>
                          )}

                          {/* Botón Cancelar: si está pendiente o confirmada */}
                          {(cita.status === 'pendiente' || cita.status === 'confirmada') && (
                            <button
                              onClick={() => handleCambiarEstado(cita._id, 'cancelada')}
                              className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                            >
                              Cancelar
                            </button>
                          )}

                          {/* Ver detalle siempre visible */}
                          <Link
                            to={`/doctor/cita/${cita._id}`}
                            className="text-blue-600 hover:underline text-xs font-medium"
                          >
                            Ver detalle
                          </Link>
                        </div>
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