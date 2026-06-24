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
import { useAuth } from '../../context/AuthContext';
// import api from '../../services/api'; // <-- tu instancia de axios, descomenta cuando la conectes

const ACCIONES = [
  {
    label: 'Agendar Cita',
    icon: CalendarPlus,
    to: '/paciente/citas/agendar',
  },
  {
    label: 'Ver Mis Citas',
    icon: CalendarDays,
    to: '/paciente/citas',
  },
  {
    label: 'Historial',
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
    <main className="min-h-screen bg-[#f5f8fd] px-4 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Encabezado de bienvenida */}
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1565D8] text-white">
            <HeartPulse size={22} />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bienvenido, {user?.nombre || 'Paciente'}
            </h1>
            <p className="text-sm text-gray-500">
              Este es el resumen de tu actividad médica.
            </p>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {ACCIONES.map(({ label, icon: Icon, to }) => (
            <Link
              key={label}
              to={to}
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm transition hover:border-[#1565D8]/30 hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1565D8]/10 text-[#1565D8]">
                <Icon size={20} />
              </span>
              <span className="text-sm font-semibold text-gray-800">{label}</span>
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Doctores disponibles */}
          <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
              <Stethoscope size={18} className="text-[#1565D8]" />
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

            <Link
              to="/paciente/citas/agendar"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1565D8] hover:underline"
            >
              <Eye size={15} />
              Ver todos los doctores
            </Link>
          </section>

          {/* Próxima cita */}
          <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
              <Clock size={18} className="text-[#1565D8]" />
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

            <Link
              to="/paciente/citas"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1565D8] hover:underline"
            >
              Ver mis citas
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
};

export default DashboardPaciente;