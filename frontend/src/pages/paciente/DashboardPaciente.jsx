import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  History,
  Stethoscope,
  Clock,
  Eye,
  HeartPulse,
} from 'lucide-react';
import './PatientDashboard.css';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { doctorService } from '../../services/doctorService';
import { citaService } from '../../services/citaService';

import AgendarCita from './citas/AgendarCita';
import MisCitas from './citas/MisCitas';
import HistorialCitas from './citas/HistorialCitas';
import DoctoresPaciente from './DoctoresPaciente';
import PerfilPaciente from './PerfilPaciente';

const toArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const formatFecha = (isoDate) => {
  if (!isoDate || typeof isoDate !== 'string') return '-';
  const [y, m, d] = isoDate.split('T')[0].split('-');
  if (!y || !m || !d) return '-';
  return `${d}/${m}/${y}`;
};

const DashboardPaciente = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  console.log('DEBUG COMPONENTES PACIENTE:', {
    AgendarCita,
    MisCitas,
    HistorialCitas,
    DoctoresPaciente,
    PerfilPaciente,
    Sidebar
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [doctores, setDoctores] = useState([]);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const path = location.pathname || '';
    if (path.endsWith('/citas/agendar')) {
      setActiveTab('agendar');
    } else if (path.endsWith('/citas/historial')) {
      setActiveTab('historial');
    } else if (path.endsWith('/citas')) {
      setActiveTab('citas');
    } else if (path.endsWith('/doctores')) {
      setActiveTab('doctores');
    } else if (path.endsWith('/perfil')) {
      setActiveTab('perfil');
    } else {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError('');
      const [doctoresRes, citasRes] = await Promise.all([
        doctorService.getAll(),
        citaService.getMine()
      ]);

      setDoctores(toArray(doctoresRes));
      setCitas(toArray(citasRes));
    } catch (err) {
      console.error('Error al cargar datos en el dashboard:', err);
      setError('No se pudieron sincronizar los datos de tu cuenta.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Filtrar la próxima cita (pendiente o confirmada más cercana en el tiempo)
  const proximaCita = useMemo(() => {
    const activas = citas.filter(c => c.status === 'pendiente' || c.status === 'confirmada');
    if (activas.length === 0) return null;
    
    // Ordenar de la más cercana a la más lejana
    return [...activas].sort((a, b) => {
      const dateA = (a.date || '') + 'T' + (a.startTime || '00:00');
      const dateB = (b.date || '') + 'T' + (b.startTime || '00:00');
      return dateA.localeCompare(dateB);
    })[0];
  }, [citas]);

  // Filtrar el historial reciente (las 3 últimas citas pasadas, completadas o canceladas)
  const historialReciente = useMemo(() => {
    const pasadas = citas.filter(c => c.status === 'completada' || c.status === 'cancelada');
    if (pasadas.length === 0) return [];

    // Ordenar de la más reciente a la más antigua
    return [...pasadas].sort((a, b) => {
      const dateA = (a.date || '') + 'T' + (a.startTime || '00:00');
      const dateB = (b.date || '') + 'T' + (b.startTime || '00:00');
      return dateB.localeCompare(dateA);
    }).slice(0, 3);
  }, [citas]);

  // Mostrar los primeros 4 doctores que tengan perfil y especialidad completa
  const doctoresVisibles = useMemo(() => {
    return doctores.filter(d => d.specialty || d.speciality).slice(0, 4);
  }, [doctores]);

  const renderContent = () => {
    switch (activeTab) {
      case 'agendar':
        return <AgendarCita isWidget={true} />;
      case 'citas':
        return <MisCitas isWidget={true} />;
      case 'historial':
        return <HistorialCitas isWidget={true} />;
      case 'doctores':
        return <DoctoresPaciente isWidget={true} />;
      case 'perfil':
        return <PerfilPaciente isWidget={true} />;
      case 'dashboard':
      default:
        return (
          <>
            {/* Encabezado de bienvenida */}
            <div className="flex items-center gap-3">
              <span className="brand-avatar">
                <HeartPulse size={22} />
              </span>
              <div>
                <h1 className="welcome-title">
                  Bienvenido, {user?.name || user?.nombre || 'Paciente'}
                </h1>
                <p className="text-sm text-gray-500">
                  Este es el resumen de tu actividad médica.
                </p>
              </div>
            </div>

            {error && (
              <p style={{ marginTop: '16px', color: '#dc2626', background: '#fef2f2', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500' }}>
                ⚠️ {error}
              </p>
            )}

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {/* Doctores disponibles */}
              <section className="panel-card lg:col-span-2">
                <h2 className="panel-title" style={{ marginBottom: '16px' }}>
                  <Stethoscope size={18} className="icon-accent" />
                  Doctores Disponibles
                </h2>

                <div className="panel-list">
                  {loading && (
                    <p className="py-3 text-sm text-gray-400">Cargando doctores...</p>
                  )}

                  {!loading && doctoresVisibles.length === 0 && (
                    <p className="py-3 text-sm text-gray-400">
                      No hay médicos disponibles con especialidad registrada.
                    </p>
                  )}

                  {!loading &&
                    doctoresVisibles.map((doc) => {
                      const docName = doc.userId?.name || doc.name || 'Doctor';
                      const docSpecialty = doc.specialty || doc.speciality || 'Médico General';
                      const docOffice = doc.office || 'Consultorio General';
                      const initials = docName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

                      return (
                        <div
                          key={doc._id}
                          className="doctor-item"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="avatar-circle">{initials}</div>
                            <div>
                              <span className="doctor-name" style={{ display: 'block' }}>{docName}</span>
                              <span className="doctor-specialty" style={{ fontSize: '12px' }}>{docSpecialty}</span>
                            </div>
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: '700', background: '#eff6ff', color: '#2563eb', padding: '3px 8px', borderRadius: '5px' }}>
                            📍 {docOffice}
                          </span>
                        </div>
                      );
                    })}
                </div>

                <Link to="/paciente/citas/agendar" className="mt-5 link-accent">
                  <Eye size={15} className="icon-accent" />
                  Agendar cita con un doctor
                </Link>
              </section>

              {/* Próxima cita */}
              <section className="panel-card">
                <h2 className="panel-title" style={{ marginBottom: '16px' }}>
                  <Clock size={18} className="icon-accent" />
                  Próxima Cita
                </h2>

                {loading && (
                  <p className="mt-4 text-sm text-gray-400">Cargando...</p>
                )}

                {!loading && !proximaCita && (
                  <p className="mt-4 text-sm text-gray-400">
                    No tienes citas programadas.
                  </p>
                )}

                {!loading && proximaCita && (
                  <div className="mt-4 rounded-lg bg-[#2563eb]/5 p-4 border border-[#2563eb]/10" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={`status-badge ${proximaCita.status}`} style={{ padding: '2px 8px', fontSize: '10px' }}>
                        {proximaCita.status ? proximaCita.status.toUpperCase() : ''}
                      </span>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                        {formatFecha(proximaCita.date)}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                        Hora: {proximaCita.startTime || '—'}
                      </p>
                    </div>
                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '4px' }}>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#2563eb' }}>
                        {proximaCita.doctorId?.userId?.name || proximaCita.doctorId?.name || 'Médico'}
                      </p>
                      <p style={{ margin: '1px 0 0', fontSize: '11px', color: '#64748b' }}>
                        {proximaCita.doctorId?.specialty || proximaCita.doctorId?.speciality || 'Especialidad'}
                      </p>
                    </div>
                  </div>
                )}

                <Link to="/paciente/citas" className="mt-5 link-accent">Ver mis citas</Link>
              </section>
            </div>

            {/* Historial reciente panel below the two panels */}
            <div className="mt-6">
              <section className="panel-card">
                <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 className="panel-title" style={{ margin: 0 }}><History size={18} className="icon-accent" /> Historial reciente</h3>
                  <Link to="/paciente/citas/historial" className="link-accent">Ver historial completo</Link>
                </div>

                <div className="panel-list">
                  {loading && (
                    <p className="text-sm text-gray-400">Cargando historial...</p>
                  )}

                  {!loading && historialReciente.length === 0 && (
                    <p className="empty-recent text-sm">No tienes consultas o citas finalizadas.</p>
                  )}

                  {!loading && historialReciente.map((cita) => {
                    const docName = cita.doctorId?.userId?.name || cita.doctorId?.name || 'Médico';
                    const docSpecialty = cita.doctorId?.specialty || cita.doctorId?.speciality || '';
                    const statusLabel = cita.status === 'completada' ? 'Finalizada' : 'Cancelada';
                    
                    return (
                      <div
                        key={cita._id}
                        className="appointment-item"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px' }}
                      >
                        <div>
                          <strong className="appoint-name" style={{ display: 'block' }}>{docName}</strong>
                          <span className="appoint-meta" style={{ fontSize: '12px' }}>
                            {docSpecialty && `${docSpecialty} • `}{formatFecha(cita.date)} a las {cita.startTime || '—'}
                          </span>
                        </div>
                        <span className={`status-badge ${cita.status}`} style={{ padding: '4px 10px', fontSize: '11px' }}>
                          {statusLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </>
        );
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="patient-dashboard min-h-screen px-4 py-10">
        <div className="patient-container mx-auto max-w-5xl">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default DashboardPaciente;