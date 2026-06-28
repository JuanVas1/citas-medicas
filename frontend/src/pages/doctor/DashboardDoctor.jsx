import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { citaService } from '../../services/citaService';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Stethoscope, User, Clock } from 'lucide-react';
import Sidebar from '../../components/Sidebar';

const toArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const DashboardDoctor = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [agenda, setAgenda] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    pendientes: 0,
    confirmadas: 0,
    completadas: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Detectar tab según la ruta
  useEffect(() => {
    const path = location.pathname || '';
    if (path.endsWith('/agenda')) {
      setActiveTab('agenda');
    } else if (path.endsWith('/perfil')) {
      setActiveTab('perfil');
    } else {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  // Cargar agenda del doctor
  const cargarAgenda = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await citaService.getDoctorAgenda();
      const citas = toArray(response);
      setAgenda(citas);
      setEstadisticas({
        total: citas.length,
        pendientes: citas.filter(c => c.status === 'pendiente').length,
        confirmadas: citas.filter(c => c.status === 'confirmada').length,
        completadas: citas.filter(c => c.status === 'completada').length
      });
    } catch (err) {
      console.error('Error al cargar agenda:', err);
      setError('No se pudo cargar la agenda.');
      setAgenda([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    cargarAgenda();
    const interval = setInterval(cargarAgenda, 30000);
    return () => clearInterval(interval);
  }, []);

  // Próxima cita (pendiente o confirmada más cercana)
  const proximaCita = useMemo(() => {
    const activas = agenda.filter(c => c.status === 'pendiente' || c.status === 'confirmada');
    if (activas.length === 0) return null;
    return [...activas].sort((a, b) => {
      const dateA = (a.date || '') + 'T' + (a.startTime || '00:00');
      const dateB = (b.date || '') + 'T' + (b.startTime || '00:00');
      return dateA.localeCompare(dateB);
    })[0];
  }, [agenda]);

  // Citas recientes completadas
  const citasRecientes = useMemo(() => {
    const completadas = agenda.filter(c => c.status === 'completada' || c.status === 'cancelada');
    if (completadas.length === 0) return [];
    return [...completadas].sort((a, b) => {
      const dateA = (a.date || '') + 'T' + (a.startTime || '00:00');
      const dateB = (b.date || '') + 'T' + (b.startTime || '00:00');
      return dateB.localeCompare(dateA);
    }).slice(0, 3);
  }, [agenda]);

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await citaService.updateStatus(id, { status: nuevoEstado });
      cargarAgenda();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al cambiar estado');
    }
  };

  const getBadge = (status) => {
    const map = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      confirmada: 'bg-blue-100 text-blue-800',
      completada: 'bg-green-100 text-green-800',
      cancelada: 'bg-red-100 text-red-800',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'agenda':
        return (
          <>
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calendar size={24} />
              Mi Agenda
            </h1>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Cargando agenda...</p>
              </div>
            ) : agenda.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-8 text-center">
                <p className="text-gray-500">No hay citas registradas aún.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow p-6">
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
                              {cita.status === 'pendiente' && (
                                <button
                                  onClick={() => handleCambiarEstado(cita._id, 'confirmada')}
                                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                                >
                                  Confirmar
                                </button>
                              )}
                              {cita.status === 'confirmada' && (
                                <button
                                  onClick={() => handleCambiarEstado(cita._id, 'completada')}
                                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                                >
                                  Completar
                                </button>
                              )}
                              {(cita.status === 'pendiente' || cita.status === 'confirmada') && (
                                <button
                                  onClick={() => handleCambiarEstado(cita._id, 'cancelada')}
                                  className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                                >
                                  Cancelar
                                </button>
                              )}
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
              </div>
            )}
          </>
        );

      case 'perfil':
        return (
          <>
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <User size={24} />
              Mi Perfil
            </h1>
            <div className="bg-white rounded-xl shadow p-6">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Nombre</label>
                    <p className="text-gray-900 mt-1">{user?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Email</label>
                    <p className="text-gray-900 mt-1">{user?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Teléfono</label>
                    <p className="text-gray-900 mt-1">{user?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Especialidad</label>
                    <p className="text-gray-900 mt-1">{user?.specialty || user?.speciality || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Consultorio</label>
                    <p className="text-gray-900 mt-1">{user?.office || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Licencia</label>
                    <p className="text-gray-900 mt-1">{user?.licenseNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'dashboard':
      default:
        return (
          <>
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                <Stethoscope size={22} className="text-blue-600" />
              </span>
              <div>
                <h1 className="text-2xl font-bold">
                  Bienvenido, {user?.name || 'Doctor'}
                </h1>
                <p className="text-sm text-gray-500">Portal médico - Hospital Digital</p>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition">
                <h3 className="text-gray-500 text-sm">Total Citas</h3>
                <p className="text-3xl font-bold mt-2 text-gray-900">{estadisticas.total}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition">
                <h3 className="text-gray-500 text-sm">Pendientes</h3>
                <p className="text-3xl font-bold mt-2 text-yellow-600">{estadisticas.pendientes}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition">
                <h3 className="text-gray-500 text-sm">Confirmadas</h3>
                <p className="text-3xl font-bold mt-2 text-blue-600">{estadisticas.confirmadas}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition">
                <h3 className="text-gray-500 text-sm">Completadas</h3>
                <p className="text-3xl font-bold mt-2 text-green-600">{estadisticas.completadas}</p>
              </div>
            </div>

            {/* Próxima cita */}
            {proximaCita ? (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock size={20} />
                  Próxima Cita
                </h2>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow p-6 text-white">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-blue-100 text-sm">Paciente</p>
                      <p className="text-lg font-semibold mt-1">{proximaCita.patientId?.name}</p>
                    </div>
                    <div>
                      <p className="text-blue-100 text-sm">Fecha</p>
                      <p className="text-lg font-semibold mt-1">{proximaCita.date}</p>
                    </div>
                    <div>
                      <p className="text-blue-100 text-sm">Hora</p>
                      <p className="text-lg font-semibold mt-1">{proximaCita.startTime}</p>
                    </div>
                    <div>
                      <p className="text-blue-100 text-sm">Motivo</p>
                      <p className="text-lg font-semibold mt-1">{proximaCita.reason}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 rounded-xl p-6 mb-8">
                <p className="text-blue-700">No tienes próximas citas agendadas.</p>
              </div>
            )}

            {/* Citas recientes */}
            {citasRecientes.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Historial Reciente</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {citasRecientes.map((cita) => (
                    <div key={cita._id} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
                      <div className="flex justify-between items-start mb-3">
                        <p className="font-semibold text-gray-900">{cita.patientId?.name}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadge(cita.status)}`}>
                          {cita.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{cita.date} - {cita.startTime}</p>
                      <p className="text-sm text-gray-700 mb-3">{cita.reason}</p>
                      <Link
                        to={`/doctor/cita/${cita._id}`}
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        Ver detalle
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default DashboardDoctor;