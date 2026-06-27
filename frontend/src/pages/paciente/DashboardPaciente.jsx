import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarPlus,
  CalendarDays,
  History,
  Stethoscope,
  Clock,
  Eye,
  HeartPulse,
} from 'lucide-react';
import './PatientDashboard.css';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
// import api from '../../services/api'; // <-- tu instancia de axios, descomenta cuando la conectes

const ACCIONES = [
  {
    label: 'Agendar Cita',
    subtitle: 'Reserva con un doctor',
    icon: CalendarPlus,
    to: '/paciente/citas/agendar',
  },
  {
    label: 'Ver Mis Citas',
    subtitle: 'Próximas y pasadas',
    icon: CalendarDays,
    to: '/paciente/citas',
  },
  {
    label: 'Historial',
    subtitle: 'Consultas anteriores',
    icon: History,
    to: '/paciente/citas/historial',
  },
  
];

// Datos de ejemplo — reemplaza esto por la respuesta real de tu backend (GET /especialidades, etc.)
const DOCTORES_MOCK = [
  //backend datso
];

// Dato de ejemplo — reemplaza por GET /citas/proxima del paciente autenticado
const PROXIMA_CITA_MOCK = null;

const formatFecha = (isoDate) => {
  if (!isoDate || typeof isoDate !== 'string') return '-';
  const [y, m, d] = isoDate.split('-');
  if (!y || !m || !d) return '-';
  return `${d}/${m}/${y}`;
};

const DashboardPaciente = () => {
  const { user } = useAuth();
  const [doctores, setDoctores] = useState([]);
  const [proximaCita, setProximaCita] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reemplaza este bloque con tus llamadas reales, por ejemplo:
    // const cargarDatos = async () => {
    //   const [resDoctores, resCita] = await Promise.all([
    //     api.get('/especialidades'),
    //     api.get('/citas/proxima'),
    //   ]);
    //   setDoctores(resDoctores.data);
    //   setProximaCita(resCita.data);
    //   setLoading(false);
    // };
    // cargarDatos();

    setDoctores(DOCTORES_MOCK);
    setProximaCita(PROXIMA_CITA_MOCK);
    setLoading(false);
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="patient-dashboard min-h-screen px-4 py-10">
        <div className="patient-container mx-auto max-w-5xl">
        {/* Encabezado de bienvenida */}
        <div className="flex items-center gap-3">
          <span className="brand-avatar">
            <HeartPulse size={22} />
          </span>
          <div>
            <h1 className="welcome-title">
              Bienvenido, {user?.nombre || 'Paciente'}
            </h1>
            <p className="text-sm text-gray-500">
              Este es el resumen de tu actividad médica.
            </p>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="mt-8 actions-grid">
          {ACCIONES.map(({ label, subtitle, icon: Icon, to }) => (
            <Link
              key={label}
              to={to}
              className="action-card flex items-center gap-3 rounded-xl px-5 py-4"
            >
              <span className="action-icon">
                <Icon size={20} />
              </span>
              <div className="action-text">
                <span className="action-label">{label}</span>
                {subtitle && <span className="action-subtitle">{subtitle}</span>}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Doctores disponibles */}
          <section className="panel-card lg:col-span-2">
            <h2 className="panel-title">
              <Stethoscope size={18} className="icon-accent" />
              Doctores Disponibles
            </h2>

            <div className="mt-4 divide-y divide-gray-100">
              {loading && (
                <p className="py-3 text-sm text-gray-400">Cargando especialidades...</p>
              )}

              {!loading && doctores.length === 0 && (
                <p className="py-3 text-sm text-gray-400">
                  No hay especialidades disponibles por el momento.
                </p>
              )}

              {!loading &&
                doctores.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {doc.especialidad}
                    </span>
                    <span className="text-xs font-semibold text-[#1565D8]">
                      {doc.disponibles} disponibles
                    </span>
                  </div>
                ))}
            </div>

            <Link to="/paciente/citas/agendar" className="mt-5 link-accent">
              <Eye size={15} className="icon-accent" />
              Ver todos los doctores
            </Link>
          </section>

          {/* Próxima cita */}
          <section className="panel-card">
            <h2 className="panel-title">
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

            {!loading && proximaCita?.fecha && (
              <div className="mt-4 rounded-lg bg-[#1565D8]/5 p-4">
                <p className="text-lg font-bold text-gray-900">
                  {formatFecha(proximaCita.fecha)}{' '}
                  <span className="font-medium text-gray-500">— {proximaCita.hora || '-'}</span>
                </p>
                <p className="mt-1 text-sm text-gray-600">{proximaCita.doctor || '-'}</p>
                <p className="text-xs font-medium text-[#1565D8]">
                  {proximaCita.especialidad || '-'}
                </p>
              </div>
            )}

            <Link to="/paciente/citas" className="mt-5 link-accent">Ver mis citas</Link>
          </section>
        </div>

        {/* Historial reciente panel below the two panels */}
        <div className="mt-6">
          <section className="panel-card">
            <div className="panel-header">
              <h3 className="panel-title"><History size={18} className="icon-accent" /> Historial reciente</h3>
              <Link to="/paciente/citas/historial" className="link-accent">Ver historial</Link>
            </div>

            <div className="panel-list">
              <p className="empty-recent text-sm">No hay historial reciente para mostrar.</p>
            </div>
          </section>
        </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPaciente;