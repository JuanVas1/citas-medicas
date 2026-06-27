import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { citaService } from '../../services/citaService';
import { doctorService } from '../../services/doctorService';
import './AdminDashboard.css';
import Sidebar from '../../components/Sidebar';
import { useLocation, useNavigate } from 'react-router-dom';

const DashboardAdmin = ({ initialTab } = {}) => {
  const { user, logout } = useAuth();

  const [citas, setCitas] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab || 'dashboard');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    cargarDatos();
  }, []);

  // Sync activeTab with pathname (/admin, /admin/citas, /admin/pacientes, /admin/usuarios)
  useEffect(() => {
    const path = location.pathname || '';
    if (path.endsWith('/citas')) setActiveTab('citas');
    else if (path.endsWith('/pacientes')) setActiveTab('pacientes');
    else if (path.endsWith('/usuarios')) setActiveTab('usuarios');
    else setActiveTab('dashboard');
  }, [location.pathname]);

  // If route like /admin/citas is accessed, redirect to /admin while keeping pathname for highlighting
  // No redirect: keep distinct paths (/admin, /admin/citas, /admin/pacientes)

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [citasRes, doctoresRes, usersRes] = await Promise.all([
        citaService.getAll(),
        doctorService.getAll(),
        // lazy require to avoid import order issues
        (async () => {
          const { userService } = await import('../../services/userService');
          return userService.getAll();
        })()
      ]);

      setCitas(citasRes.data || []);
      setDoctors(doctoresRes.data || []);
      setUsers(usersRes.data || []);
    } catch (error) {
      console.error(error);
      setCitas([]);
      setDoctors([]);
    }
  };

  const summary = useMemo(() => ({
    total: citas.length,
    pending: citas.filter((c) => c.status === 'pendiente').length,
    confirmed: citas.filter((c) => c.status === 'confirmada').length,
    completed: citas.filter((c) => c.status === 'completada').length,
  }), [citas]);

  const filteredCitas = useMemo(() => {
    if (filter === 'all') return citas;
    return citas.filter((c) => c.status === filter);
  }, [citas, filter]);

  /* Subtle SVG icons that inherit color via currentColor */
  const IconDashboard = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 13h8V3H3v10z" />
      <path d="M13 21h8V11h-8v10z" />
    </svg>
  );

  const IconCalendar = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  const IconPatients = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 11c1.657 0 3 1.343 3 3v1" />
      <path d="M6 11c-1.657 0-3 1.343-3 3v1" />
      <circle cx="12" cy="7" r="3" />
      <path d="M6 18v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1" />
    </svg>
  );

  const IconDoctor = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 7v6a6 6 0 0 0 12 0V7" />
      <circle cx="12" cy="4" r="1.5" />
      <path d="M12 13v6" />
    </svg>
  );

  const IconClock = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  );

  const IconTag = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.59 13.41L11 3 3 11l8.59 8.59a2 2 0 0 0 2.82 0l6.18-6.18a2 2 0 0 0 0-2.82z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
  );

  const IconInvoice = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15V6a2 2 0 0 0-2-2H7L3 6v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="12" y2="14" />
    </svg>
  );

  const IconStats = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );

  const IconUser = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard /> },
    { id: 'citas', label: 'Citas', icon: <IconCalendar /> },
    { id: 'pacientes', label: 'Pacientes', icon: <IconPatients /> },
    { id: 'doctores', label: 'Doctores', icon: <IconDoctor /> },
    { id: 'horarios', label: 'Horarios', icon: <IconClock /> },
    { id: 'especialidades', label: 'Especialidades', icon: <IconTag /> },
    { id: 'facturacion', label: 'Facturación', icon: <IconInvoice /> },
    { id: 'estadisticas', label: 'Estadísticas', icon: <IconStats /> },
    { id: 'usuarios', label: 'Usuarios', icon: <IconUser /> }
  ];

  const IconCheck = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );

  const IconX = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': {
        // derive upcoming citas (simple sort by date+time) and first 3
        const upcoming = [...citas]
          .filter(c => c.date)
          .sort((a, b) => ((a.date || '') + ' ' + (a.startTime || '')).localeCompare((b.date || '') + ' ' + (b.startTime || '')))
          .slice(0, 3);

        const availableDoctors = doctors.slice(0, 3);

        return (
          <>
            <section className="stats-section fade-in">
              <article className="stat-card">
                <div className="stat-icon calendar">
                  <IconCalendar />
                </div>
                <strong>{summary.total}</strong>
                <span>Total citas</span>
              </article>
              <article className="stat-card">
                <div className="stat-icon clock">
                  <IconClock />
                </div>
                <strong>{summary.pending}</strong>
                <span>Pendientes</span>
              </article>
              <article className="stat-card">
                <div className="stat-icon check">
                  <IconCheck />
                </div>
                <strong>{summary.confirmed}</strong>
                <span>Completadas</span>
              </article>
              <article className="stat-card">
                <div className="stat-icon cancel">
                  <IconX />
                </div>
                <strong>{citas.filter(c => c.status === 'cancelada').length}</strong>
                <span>Canceladas</span>
              </article>
            </section>

            <div className="dashboard-panels">
              <div className="panel-card">
                <div className="panel-header">
                  <h3>Próximas citas</h3>
                  <button className="link-btn" onClick={() => setActiveTab('citas')} type="button">Ver todas →</button>
                </div>

                <div className="panel-list">
                  {upcoming.length === 0 ? (
                    <div className="empty-state">No hay próximas citas.</div>
                  ) : (
                    upcoming.map((c) => (
                      <div key={c._id} className="appointment-item">
                        <div className="avatar-circle">{(c.patientId?.name || 'P').charAt(0)}</div>
                        <div className="appointment-info">
                          <div className="appoint-top">
                            <strong className="appoint-name">{c.patientId?.name || 'Paciente'}</strong>
                            <span className={`status-badge ${c.status}`}>{c.status ? c.status.charAt(0).toUpperCase() + c.status.slice(1) : ''}</span>
                          </div>
                          <div className="appoint-meta">{c.doctorId?.name || 'Doctor'} · {c.doctorId?.speciality || ''} · {c.startTime || c.date || ''}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="panel-card">
                <div className="panel-header">
                  <h3>Doctores disponibles</h3>
                  <button className="link-btn" onClick={() => setActiveTab('doctores')} type="button">Ver todos →</button>
                </div>

                <div className="panel-list">
                  {availableDoctors.length === 0 ? (
                    <div className="empty-state">No hay doctores.</div>
                  ) : (
                    availableDoctors.map((d) => (
                      <div key={d._id} className="doctor-item">
                        <div className="avatar-circle">{(d.name || 'D').split(' ').map(n => n.charAt(0)).slice(0,2).join('')}</div>
                        <div className="doctor-info">
                          <strong className="doctor-name">{d.name}</strong>
                          <div className="doctor-specialty">{d.speciality || ''}</div>
                        </div>
                        <div className="doctor-status-dot">
                          <span className={`dot ${d.active ? 'available' : 'offline'}`} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        );
      }

      case 'citas':
        return (
          <section className="appointments-section fade-in">
            <div className="section-header">
              <div>
                <span className="eyebrow">Agenda</span>
                <h2>Lista de Citas</h2>
              </div>

              <div className="filter-buttons">
                {[
                  ['all', 'Todas'],
                  ['pendiente', 'Pendientes'],
                  ['confirmada', 'Confirmadas'],
                  ['completada', 'Completadas'],
                  ['cancelada', 'Canceladas']
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setFilter(value)}
                    className={`filter-btn ${filter === value ? 'active' : ''}`}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="empty-state">Cargando citas...</div>
            ) : filteredCitas.length === 0 ? (
              <div className="empty-state">No hay citas para mostrar.</div>
            ) : (
              <div className="appointments-list">
                {filteredCitas.map((cita) => (
                  <article key={cita._id} className="appointment-card">
                    <div className="appointment-main">
                      <div>
                        <span className={`status-badge ${cita.status}`}>
                          {cita.status.charAt(0).toUpperCase() + cita.status.slice(1)}
                        </span>
                        <h3>{cita.doctorId?.name || 'Doctor'}</h3>
                      </div>

                      <dl className="appointment-details">
                        <div>
                          <dt>Paciente</dt>
                          <dd>{cita.patientId?.name || 'Paciente'}</dd>
                        </div>
                        <div>
                          <dt>Email</dt>
                          <dd>{cita.patientId?.email || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt>Teléfono</dt>
                          <dd>{cita.patientId?.phone || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt>Especialidad</dt>
                          <dd>{cita.doctorId?.speciality || 'N/A'}</dd>
                        </div>
                        <div>
                          <dt>Fecha</dt>
                          <dd>{cita.date}</dd>
                        </div>
                        <div>
                          <dt>Hora</dt>
                          <dd>{cita.startTime || 'N/A'}</dd>
                        </div>
                      </dl>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        );

      case 'pacientes':
        return (
          <section className="appointments-section fade-in">
            <div className="section-header">
              <div>
                <span className="eyebrow">Gestión</span>
                <h2>Pacientes</h2>
              </div>
            </div>
            <div className="empty-state">Módulo de pacientes en desarrollo.</div>
          </section>
        );

      case 'doctores':
        return (
          <section className="doctors-section fade-in">
            <div className="section-header">
              <div>
                <span className="eyebrow">Equipo</span>
                <h2>Directorio de Doctores</h2>
              </div>
            </div>

            {loading ? (
              <div className="empty-state">Cargando doctores...</div>
            ) : doctors.length === 0 ? (
              <div className="empty-state">No hay doctores registrados.</div>
            ) : (
              <div className="doctors-list">
                {doctors.map((doctor) => (
                  <article key={doctor._id} className="doctor-card">
                    <div className="doctor-header">
                      <h3>{doctor.name}</h3>
                      <span className={`doctor-status ${doctor.active ? 'active' : 'inactive'}`}>
                        {doctor.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    <dl className="doctor-body">
                      <div>
                        <dt>Especialidad</dt>
                        <dd>{doctor.speciality || 'N/A'}</dd>
                      </div>
                      <div>
                        <dt>Email</dt>
                        <dd>{doctor.email || 'N/A'}</dd>
                      </div>
                      <div>
                        <dt>Teléfono</dt>
                        <dd>{doctor.phone || 'N/A'}</dd>
                      </div>
                      <div>
                        <dt>Licencia</dt>
                        <dd>{doctor.licenseNumber || 'N/A'}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            )}
          </section>
        );

      case 'horarios':
        return (
          <section className="appointments-section fade-in">
            <div className="section-header">
              <div>
                <span className="eyebrow">Programación</span>
                <h2>Horarios</h2>
              </div>
            </div>
            <div className="empty-state">Módulo de horarios en desarrollo.</div>
          </section>
        );

      case 'especialidades':
        return (
          <section className="appointments-section fade-in">
            <div className="section-header">
              <div>
                <span className="eyebrow">Catálogo</span>
                <h2>Especialidades</h2>
              </div>
            </div>
            <div className="empty-state">Módulo de especialidades en desarrollo.</div>
          </section>
        );

      case 'facturacion':
        return (
          <section className="appointments-section fade-in">
            <div className="section-header">
              <div>
                <span className="eyebrow">Finanzas</span>
                <h2>Facturación</h2>
              </div>
            </div>
            <div className="empty-state">Módulo de facturación en desarrollo.</div>
          </section>
        );

      case 'estadisticas':
        return (
          <section className="appointments-section fade-in">
            <div className="section-header">
              <div>
                <span className="eyebrow">Reportes</span>
                <h2>Estadísticas</h2>
              </div>
            </div>
            <div className="stats-section">
              <article className="stat-card">
                <strong>{summary.total}</strong>
                <span>Citas registradas</span>
              </article>
              <article className="stat-card">
                <strong>{doctors.length}</strong>
                <span>Doctores activos</span>
              </article>
              <article className="stat-card">
                <strong>{summary.pending}</strong>
                <span>Pendientes</span>
              </article>
              <article className="stat-card">
                <strong>{summary.confirmed}</strong>
                <span>Confirmadas</span>
              </article>
            </div>
          </section>
        );

      case 'usuarios':
        return (
          <section className="appointments-section fade-in">
            <div className="section-header">
              <div>
                <span className="eyebrow">Seguridad</span>
                <h2>Usuarios</h2>
              </div>
            </div>

                {users.length === 0 ? (
                  <div className="empty-state">No hay usuarios para mostrar.</div>
                ) : (
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Usuarios del sistema</h3>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="p-2 text-left">Nombre</th>
                          <th className="p-2 text-left">Email</th>
                          <th className="p-2 text-left">Rol</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u._id} className="border-b">
                            <td className="p-2">{u.name}</td>
                            <td className="p-2">{u.email}</td>
                            <td className="p-2">{u.role}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="dashboard-main-content">
        <header className="main-header">
          <div className="header-titles">
            <h1>
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'citas' && 'Citas'}
              {activeTab === 'pacientes' && 'Pacientes'}
              {activeTab === 'doctores' && 'Doctores'}
              {activeTab === 'horarios' && 'Horarios'}
              {activeTab === 'especialidades' && 'Especialidades'}
              {activeTab === 'facturacion' && 'Facturación'}
              {activeTab === 'estadisticas' && 'Estadísticas'}
              {activeTab === 'usuarios' && 'Usuarios'}
            </h1>
            <p className="subtitle">
              {activeTab === 'dashboard' && 'Vista general del panel administrativo.'}
              {activeTab === 'citas' && 'Administra las citas programadas por los pacientes.'}
              {activeTab === 'pacientes' && 'Gestiona la información de los pacientes.'}
              {activeTab === 'doctores' && 'Visualiza y administra a los doctores.'}
              {activeTab === 'horarios' && 'Configura la disponibilidad de horarios.'}
              {activeTab === 'especialidades' && 'Administra las especialidades médicas.'}
              {activeTab === 'facturacion' && 'Revisa y gestiona los pagos.'}
              {activeTab === 'estadisticas' && 'Consulta métricas del sistema.'}
              {activeTab === 'usuarios' && 'Gestiona los usuarios del sistema.'}
            </p>
          </div>
        </header>

        <div className="content-area">{renderContent()}</div>
      </main>
    </div>
  );
};

export default DashboardAdmin;