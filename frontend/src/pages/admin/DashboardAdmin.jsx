import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { citaService } from '../../services/citaService';
import { doctorService } from '../../services/doctorService';
import { horarioService } from '../../services/horarioService';
import './AdminDashboard.css';
import Sidebar from '../../components/Sidebar';
import { useLocation, useNavigate } from 'react-router-dom';

const DashboardAdmin = ({ initialTab } = {}) => {
  const { user, logout } = useAuth();

  const [citas, setCitas] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab || 'dashboard');
  const [filter, setFilter] = useState('all');

  // Doctor Form States
  const [docForm, setDocForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialty: '',
    office: '',
    licenseNumber: ''
  });
  const [docFormError, setDocFormError] = useState('');
  const [docFormSuccess, setDocFormSuccess] = useState('');
  const [docSubmitting, setDocSubmitting] = useState(false);

  // Auto-dismiss del mensaje de éxito al registrar doctor
  useEffect(() => {
    if (!docFormSuccess) return;
    const t = setTimeout(() => setDocFormSuccess(''), 3000);
    return () => clearTimeout(t);
  }, [docFormSuccess]);

  // Modal editar / completar perfil de doctor
  const [editModal, setEditModal] = useState(null); // null | { doctor, isNew }
  const [editForm, setEditForm] = useState({ specialty: '', office: '', licenseNumber: '' });
  const [editError, setEditError] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  const openEditModal = (doctor) => {
    const isNew = !!doctor._isUserOnly;
    setEditForm({
      specialty: doctor.specialty || doctor.speciality || '',
      office: doctor.office || '',
      licenseNumber: doctor.licenseNumber || ''
    });
    setEditError('');
    setEditModal({ doctor, isNew });
  };

  const closeEditModal = () => {
    setEditModal(null);
    setEditError('');
  };

  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitDoctorProfile = async (e) => {
    e.preventDefault();
    if (editSubmitting) return;

    // Validación local
    if (!editForm.specialty.trim() || !editForm.office.trim()) {
      setEditError('La especialidad y el consultorio son obligatorios.');
      return;
    }

    setEditError('');
    setEditSubmitting(true);
    try {
      if (editModal.isNew) {
        // Crear perfil para usuario existente que no tiene Doctor doc
        // El _id del objeto es el _id del User (ya que se construyó desde users)
        const userId = editModal.doctor.userId?._id || editModal.doctor._id;
        console.log('[completar perfil] userId:', userId, 'form:', editForm);
        await doctorService.createFromUser(userId, {
          specialty: editForm.specialty.trim(),
          office: editForm.office.trim(),
          licenseNumber: editForm.licenseNumber.trim()
        });
      } else {
        // Actualizar doctor existente usando su _id de Doctor
        const doctorId = editModal.doctor._id;
        console.log('[editar perfil] doctorId:', doctorId, 'form:', editForm);
        await doctorService.update(doctorId, {
          specialty: editForm.specialty.trim(),
          office: editForm.office.trim(),
          licenseNumber: editForm.licenseNumber.trim()
        });
      }
      closeEditModal();
      await cargarDatos();
    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.error;
      console.error('[submitDoctorProfile] error:', status, msg, error);
      setEditError(msg || `Error al guardar el perfil (HTTP ${status || 'sin respuesta'}). Revisa la consola.`);
    } finally {
      setEditSubmitting(false);
    }
  };


  const handleDocFormChange = (e) => {
    setDocForm({
      ...docForm,
      [e.target.name]: e.target.value
    });
  };

  const crearDoctor = async (e) => {
    e.preventDefault();
    if (docSubmitting) return;
    setDocFormError('');
    setDocFormSuccess('');
    setDocSubmitting(true);
    try {
      // Normalize email to lowercase to avoid false "already registered" errors
      const payload = { ...docForm, email: docForm.email.trim().toLowerCase() };
      await doctorService.create(payload);
      setDocFormSuccess('Doctor registrado exitosamente');
      setDocForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        specialty: '',
        office: '',
        licenseNumber: ''
      });
      await cargarDatos();
    } catch (error) {
      setDocFormError(error.response?.data?.error || 'Error al registrar al doctor');
    } finally {
      setDocSubmitting(false);
    }
  };

  // Schedule Form States
  const [horarioForm, setHorarioForm] = useState({
    doctorId: '',
    day: '',
    startTime: '',
    endTime: ''
  });
  const [horarioFormError, setHorarioFormError] = useState('');
  const [horarioFormSuccess, setHorarioFormSuccess] = useState('');
  const [horarioSubmitting, setHorarioSubmitting] = useState(false);

  // Auto-dismiss del mensaje de éxito de horario
  useEffect(() => {
    if (!horarioFormSuccess) return;
    const t = setTimeout(() => setHorarioFormSuccess(''), 3000);
    return () => clearTimeout(t);
  }, [horarioFormSuccess]);

  // Genera slots de tiempo cada 30 min entre startHour y endHour
  const timeSlots = (() => {
    const slots = [];
    for (let h = 6; h <= 22; h++) {
      ['00', '30'].forEach(m => {
        if (h === 22 && m === '30') return;
        const label = `${String(h).padStart(2, '0')}:${m}`;
        slots.push(label);
      });
    }
    return slots;
  })();

  // Doctor seleccionado en el formulario de horario
  const selectedHorarioDoctor = doctors.find(d => d._id === horarioForm.doctorId) || null;

  const handleHorarioFormChange = (e) => {
    setHorarioForm({
      ...horarioForm,
      [e.target.name]: e.target.value
    });
  };

  const crearHorario = async (e) => {
    e.preventDefault();
    if (horarioSubmitting) return;
    setHorarioFormError('');
    setHorarioFormSuccess('');

    // Validar que fin > inicio
    if (horarioForm.startTime && horarioForm.endTime && horarioForm.startTime >= horarioForm.endTime) {
      setHorarioFormError('La hora de fin debe ser mayor a la hora de inicio.');
      return;
    }

    setHorarioSubmitting(true);
    try {
      await horarioService.create(horarioForm);
      setHorarioFormSuccess('✓ Horario registrado exitosamente');
      setHorarioForm({ doctorId: '', day: '', startTime: '', endTime: '' });
      cargarDatos();
    } catch (error) {
      setHorarioFormError(error.response?.data?.error || 'Error al registrar el horario');
    } finally {
      setHorarioSubmitting(false);
    }
  };

  const eliminarHorario = async (id) => {
    if (!window.confirm('¿Eliminar horario?')) return;
    try {
      await horarioService.delete(id);
      cargarDatos();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Sync activeTab with pathname (/admin, /admin/citas, /admin/pacientes, /admin/usuarios, /admin/doctores, /admin/horarios, /admin/especialidades, etc.)
  useEffect(() => {
    const path = location.pathname || '';
    if (path.endsWith('/citas')) setActiveTab('citas');
    else if (path.endsWith('/pacientes')) setActiveTab('pacientes');
    else if (path.endsWith('/usuarios')) setActiveTab('usuarios');
    else if (path.endsWith('/doctores')) setActiveTab('doctores');
    else if (path.endsWith('/horarios')) setActiveTab('horarios');
    else if (path.endsWith('/especialidades')) setActiveTab('especialidades');
    else if (path.endsWith('/facturacion')) setActiveTab('facturacion');
    else if (path.endsWith('/estadisticas')) setActiveTab('estadisticas');
    else setActiveTab('dashboard');
  }, [location.pathname]);

  // If route like /admin/citas is accessed, redirect to /admin while keeping pathname for highlighting
  // No redirect: keep distinct paths (/admin, /admin/citas, /admin/pacientes)

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [citasRes, doctoresRes, usersRes, horariosRes] = await Promise.all([
        citaService.getAll(),
        doctorService.getAll(),
        // lazy require to avoid import order issues
        (async () => {
          const { userService } = await import('../../services/userService');
          return userService.getAll();
        })(),
        horarioService.getAll()
      ]);

      setCitas(citasRes.data || []);
      setDoctors(doctoresRes.data || []);
      setUsers(usersRes.data || []);
      setHorarios(horariosRes.data || []);
    } catch (error) {
      console.error(error);
      setCitas([]);
      setDoctors([]);
      setHorarios([]);
    } finally {
      setLoading(false);
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

  // Merge Doctor-profile records with users who have role='doctor' but no Doctor profile yet.
  // This handles doctors created via the Users panel (User exists, Doctor profile does not).
  const allDoctorUsers = useMemo(() => {
    // Collect all userId strings that already have a Doctor profile
    const docUserIds = new Set(
      doctors.map(d => (d.userId?._id || d.userId)?.toString()).filter(Boolean)
    );
    // Users with role='doctor' that have no matching Doctor profile
    const usersWithoutProfile = users
      .filter(u => u.role === 'doctor' && !docUserIds.has(u._id?.toString()))
      .map(u => ({
        _id: u._id,
        userId: u,
        specialty: null,
        office: null,
        licenseNumber: null,
        active: true,
        _isUserOnly: true   // flag to show "Sin perfil" badge
      }));
    return [...doctors, ...usersWithoutProfile];
  }, [doctors, users]);

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
                  <button className="link-btn" onClick={() => navigate('/admin/citas')} type="button">Ver todas →</button>
                </div>

                <div className="panel-list">
                  {upcoming.length === 0 ? (
                    <div className="empty-state">No hay próximas citas.</div>
                  ) : (
                    upcoming.map((c) => {
                      const pacienteName = c.patientId?.name || 'Paciente';
                      const doctorName = c.doctorId?.userId?.name || c.doctorId?.name || 'Doctor';
                      const doctorSpecialty = c.doctorId?.specialty || c.doctorId?.speciality || '';
                      const hora = c.startTime || '';
                      const fecha = c.date ? new Date(c.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : '';
                      const patientInitial = pacienteName.charAt(0).toUpperCase();
                      return (
                        <div key={c._id} className="appointment-item" style={{ alignItems: 'flex-start', padding: '10px 6px', borderBottom: '1px solid #f8fafc' }}>
                          <div className="avatar-circle" style={{ background: '#0f172a', flexShrink: 0 }}>{patientInitial}</div>
                          <div className="appointment-info" style={{ flex: 1, minWidth: 0 }}>
                            <div className="appoint-top" style={{ marginBottom: '4px' }}>
                              <strong className="appoint-name" style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                                {pacienteName}
                              </strong>
                              <span className={`status-badge ${c.status}`}>
                                {c.status ? c.status.charAt(0).toUpperCase() + c.status.slice(1) : ''}
                              </span>
                            </div>
                            {/* Doctor info */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '12px', fontWeight: '600', color: '#2563eb' }}>{doctorName}</span>
                              {doctorSpecialty && (
                                <>
                                  <span style={{ color: '#cbd5e1', fontSize: '11px' }}>•</span>
                                  <span style={{ fontSize: '11px', color: '#64748b' }}>{doctorSpecialty}</span>
                                </>
                              )}
                            </div>
                            {/* Hora y fecha */}
                            {(hora || fecha) && (
                              <div style={{ marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ fontSize: '11px' }}>🕐</span>
                                <span style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>
                                  {fecha}{fecha && hora ? ' · ' : ''}{hora}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="panel-card">
                <div className="panel-header">
                  <h3>Doctores disponibles</h3>
                  <button
                    className="link-btn"
                    onClick={() => navigate('/admin/doctores')}
                    type="button"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}
                  >
                    Ver todos →
                  </button>
                </div>

                <div className="panel-list">
                  {availableDoctors.length === 0 ? (
                    <div className="empty-state">No hay doctores registrados.</div>
                  ) : (
                    availableDoctors.map((d) => {
                      const nombre = d.userId?.name || d.name || 'Doctor';
                      const especialidad = d.specialty || d.speciality || '';
                      const consultorio = d.office || '';
                      const initials = nombre.split(' ').map(n => n.charAt(0)).filter(Boolean).slice(0, 2).join('').toUpperCase();
                      return (
                        <div key={d._id} className="doctor-item" style={{ alignItems: 'flex-start', padding: '10px 6px', borderBottom: '1px solid #f1f5f9' }}>
                          <div
                            className="avatar-circle"
                            style={{ background: '#2563EB', flexShrink: 0, fontSize: '13px', fontWeight: '700' }}
                          >
                            {initials}
                          </div>
                          <div className="doctor-info" style={{ flex: 1, minWidth: 0 }}>
                            <strong className="doctor-name" style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {nombre}
                            </strong>
                            {especialidad && (
                              <div className="doctor-specialty" style={{ fontSize: '11px', color: '#64748b', marginTop: '1px' }}>
                                {especialidad}
                              </div>
                            )}
                            {consultorio && (
                              <div style={{ marginTop: '4px' }}>
                                <span style={{ fontSize: '10px', fontWeight: '600', background: '#eff6ff', color: '#2563eb', padding: '1px 7px', borderRadius: '4px' }}>
                                  {consultorio}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="doctor-status-dot" style={{ flexShrink: 0, paddingTop: '3px' }}>
                            <span className={`dot ${d.active !== false ? 'available' : 'offline'}`} />
                          </div>
                        </div>
                      );
                    })
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
                        <h3>{cita.doctorId?.userId?.name || cita.doctorId?.name || 'Doctor'}</h3>
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
                          <dd>{cita.doctorId?.specialty || cita.doctorId?.speciality || 'N/A'}</dd>
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

      case 'pacientes': {
        const pacientes = users.filter(u => u.role === 'paciente');
        return (
          <section className="appointments-section fade-in">
            <div className="section-header">
              <div>
                <span className="eyebrow">Gestión</span>
                <h2>Pacientes</h2>
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', background: '#f1f5f9', padding: '6px 14px', borderRadius: '8px' }}>
                {pacientes.length} paciente{pacientes.length !== 1 ? 's' : ''} registrado{pacientes.length !== 1 ? 's' : ''}
              </span>
            </div>

            {loading ? (
              <div className="empty-state">Cargando pacientes...</div>
            ) : pacientes.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
                <div>No hay pacientes registrados en el sistema.</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', marginTop: '4px' }}>
                {pacientes.map((p) => {
                  const initials = (p.name || 'P').split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
                  const citasPaciente = citas.filter(c => c.patientId?._id === p._id || c.patientId === p._id);
                  const pendientes = citasPaciente.filter(c => c.status === 'pendiente').length;
                  const completadas = citasPaciente.filter(c => c.status === 'completada').length;
                  const fechaReg = p.createdAt ? new Date(p.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
                  return (
                    <article key={p._id} style={{
                      background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px',
                      padding: '20px', transition: 'transform 0.2s, box-shadow 0.2s',
                      display: 'flex', flexDirection: 'column', gap: '14px'
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                    >
                      {/* Cabecera */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '44px', height: '44px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, #6366f1, #2563eb)',
                          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: '700', fontSize: '15px', flexShrink: 0
                        }}>
                          {initials}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: '700', fontSize: '14px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.name || '—'}
                          </p>
                          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.email || '—'}
                          </p>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: '600', background: '#dcfce7', color: '#15803d', padding: '3px 9px', borderRadius: '6px', flexShrink: 0 }}>
                          Activo
                        </span>
                      </div>

                      {/* Datos */}
                      <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <p style={{ margin: 0, fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Teléfono</p>
                          <p style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: '500', color: '#1e293b' }}>{p.phone || '—'}</p>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Registro</p>
                          <p style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: '500', color: '#1e293b' }}>{fechaReg}</p>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Citas totales</p>
                          <p style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: '700', color: '#2563eb' }}>{citasPaciente.length}</p>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Pendientes</p>
                          <p style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: '700', color: pendientes > 0 ? '#d97706' : '#64748b' }}>{pendientes}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        );
      }


      case 'doctores':
        return (
          <section className="doctors-section fade-in">
            <div className="section-header">
              <div>
                <span className="eyebrow">Equipo</span>
                <h2>Directorio y Gestión de Doctores</h2>
              </div>
            </div>

            <div className="doctors-layout">
              {/* PANEL DE REGISTRO */}
              <div className="panel-card">
                <div className="panel-header">
                  <h3>Registrar Doctor</h3>
                </div>

                <form onSubmit={crearDoctor} style={{ marginTop: '12px' }}>
                  {docFormSuccess && <div className="alert-success">{docFormSuccess}</div>}
                  {docFormError && <div className="alert-error">{docFormError}</div>}

                  <div className="form-group">
                    <label htmlFor="doc-name">Nombre Completo</label>
                    <input
                      id="doc-name"
                      name="name"
                      type="text"
                      className="form-input"
                      placeholder="Ej. Dr. Carlos Mendoza"
                      value={docForm.name}
                      onChange={handleDocFormChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="doc-email">Correo Electrónico</label>
                    <input
                      id="doc-email"
                      name="email"
                      type="email"
                      className="form-input"
                      placeholder="ejemplo@medadmin.com"
                      value={docForm.email}
                      onChange={handleDocFormChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="doc-password">Contraseña</label>
                    <input
                      id="doc-password"
                      name="password"
                      type="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={docForm.password}
                      onChange={handleDocFormChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="doc-phone">Teléfono</label>
                    <input
                      id="doc-phone"
                      name="phone"
                      type="tel"
                      className="form-input"
                      placeholder="Ej. +51 987654321"
                      value={docForm.phone}
                      onChange={handleDocFormChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="doc-specialty">Especialidad</label>
                    <input
                      id="doc-specialty"
                      name="specialty"
                      type="text"
                      className="form-input"
                      placeholder="Ej. Cardiología, Pediatría"
                      value={docForm.specialty}
                      onChange={handleDocFormChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="doc-office">Consultorio</label>
                    <input
                      id="doc-office"
                      name="office"
                      type="text"
                      className="form-input"
                      placeholder="Ej. Consultorio 302-A"
                      value={docForm.office}
                      onChange={handleDocFormChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="doc-license">Número de Licencia (CMP)</label>
                    <input
                      id="doc-license"
                      name="licenseNumber"
                      type="text"
                      className="form-input"
                      placeholder="CMP o Número de Licencia"
                      value={docForm.licenseNumber}
                      onChange={handleDocFormChange}
                    />
                  </div>

                  <button
                    type="submit"
                    className="form-submit-btn w-full"
                    style={{ marginTop: '8px', opacity: docSubmitting ? 0.65 : 1, cursor: docSubmitting ? 'not-allowed' : 'pointer' }}
                    disabled={docSubmitting}
                  >
                    {docSubmitting ? 'Registrando...' : 'Registrar Doctor'}
                  </button>
                </form>
              </div>

              {/* LISTADO DE DOCTORES */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>
                    {allDoctorUsers.length} doctor{allDoctorUsers.length !== 1 ? 'es' : ''} en el sistema
                  </span>
                  {allDoctorUsers.some(d => d._isUserOnly) && (
                    <span style={{ fontSize: '11px', color: '#d97706', fontWeight: '600', background: '#fef3c7', padding: '2px 8px', borderRadius: '4px' }}>
                      {allDoctorUsers.filter(d => d._isUserOnly).length} sin perfil médico
                    </span>
                  )}
                </div>
                {loading ? (
                  <div className="empty-state">Cargando doctores...</div>
                ) : allDoctorUsers.length === 0 ? (
                  <div className="empty-state">No hay doctores registrados.</div>
                ) : (
                  <div className="doctors-list">
                    {allDoctorUsers.map((doctor) => {
                      const nombre = doctor.userId?.name || doctor.name || '?';
                      const initials = nombre.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
                      return (
                        <article key={doctor._id} className="doctor-card">
                          <div className="doctor-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div className="avatar-circle" style={{ background: doctor._isUserOnly ? '#64748b' : '#2563EB', flexShrink: 0 }}>{initials}</div>
                              <div>
                                <h3 style={{ fontWeight: '700', fontSize: '15px', margin: '0 0 2px' }}>{nombre}</h3>
                                <span style={{ fontSize: '12px', color: '#64748b' }}>{doctor.userId?.email || doctor.email || ''}</span>
                              </div>
                            </div>
                            {doctor._isUserOnly ? (
                              <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px', background: '#fef9c3', color: '#92400e', whiteSpace: 'nowrap' }}>
                                Sin perfil
                              </span>
                            ) : (
                              <span className={`doctor-status ${doctor.active !== false ? 'active' : 'inactive'}`}>
                                {doctor.active !== false ? 'Activo' : 'Inactivo'}
                              </span>
                            )}
                          </div>

                          <dl className="doctor-body">
                            <div>
                              <dt>Especialidad</dt>
                              <dd>{doctor.specialty || doctor.speciality || (doctor._isUserOnly ? 'Sin asignar' : '—')}</dd>
                            </div>
                            <div>
                              <dt>Consultorio</dt>
                              <dd>{doctor.office || (doctor._isUserOnly ? 'Sin asignar' : '—')}</dd>
                            </div>
                            <div>
                              <dt>Teléfono</dt>
                              <dd>{doctor.userId?.phone || doctor.phone || '—'}</dd>
                            </div>
                            <div>
                              <dt>Licencia</dt>
                              <dd>{doctor.licenseNumber || (doctor._isUserOnly ? 'Sin asignar' : '—')}</dd>
                            </div>
                          </dl>

                          {doctor._isUserOnly ? (
                            <div style={{ marginTop: '12px', padding: '10px 12px', background: '#fef3c7', borderRadius: '8px', fontSize: '12px', color: '#92400e', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                              <span>⚠️ Perfil médico incompleto</span>
                              <button
                                type="button"
                                onClick={() => openEditModal(doctor)}
                                style={{ background: '#d97706', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}
                              >
                                Completar perfil
                              </button>
                            </div>
                          ) : (
                            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                              <button
                                type="button"
                                onClick={() => openEditModal(doctor)}
                                style={{ background: '#f1f5f9', color: '#2563eb', border: '1px solid #2563eb', borderRadius: '6px', padding: '6px 16px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                              >
                                ✏️ Editar
                              </button>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* MODAL COMPLETAR / EDITAR PERFIL */}
            {editModal && (
              <div
                style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                onClick={(e) => { if (e.target === e.currentTarget) closeEditModal(); }}
              >
                <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '440px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', animation: 'fadeIn 0.2s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '11px', fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {editModal.isNew ? 'Completar perfil' : 'Editar perfil'}
                      </p>
                      <h3 style={{ margin: '4px 0 0', fontSize: '17px', color: '#0f172a' }}>
                        {editModal.doctor.userId?.name || editModal.doctor.name || 'Doctor'}
                      </h3>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                        {editModal.doctor.userId?.email || editModal.doctor.email || ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={closeEditModal}
                      style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={submitDoctorProfile}>
                    {editError && (
                      <div className="alert-error" style={{ marginBottom: '16px' }}>{editError}</div>
                    )}

                    <div className="form-group">
                      <label htmlFor="edit-specialty">Especialidad *</label>
                      <input
                        id="edit-specialty"
                        name="specialty"
                        type="text"
                        className="form-input"
                        placeholder="Ej. Cardiología, Pediatría"
                        value={editForm.specialty}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="edit-office">Consultorio *</label>
                      <input
                        id="edit-office"
                        name="office"
                        type="text"
                        className="form-input"
                        placeholder="Ej. Consultorio 302-A"
                        value={editForm.office}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="edit-license">Número de Licencia (CMP)</label>
                      <input
                        id="edit-license"
                        name="licenseNumber"
                        type="text"
                        className="form-input"
                        placeholder="CMP o Número de Licencia"
                        value={editForm.licenseNumber}
                        onChange={handleEditFormChange}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                      <button
                        type="button"
                        onClick={closeEditModal}
                        style={{ flex: 1, background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '11px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="form-submit-btn"
                        style={{ flex: 2, opacity: editSubmitting ? 0.65 : 1, cursor: editSubmitting ? 'not-allowed' : 'pointer' }}
                        disabled={editSubmitting}
                      >
                        {editSubmitting ? 'Guardando...' : (editModal.isNew ? '✓ Completar perfil' : '✓ Guardar cambios')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </section>
        );

      case 'horarios':
        return (
          <section className="doctors-section fade-in">
            <div className="section-header">
              <div>
                <span className="eyebrow">Programación</span>
                <h2>Gestión de Horarios Médicos</h2>
              </div>
              {/* Toast de éxito flotante */}
              {horarioFormSuccess && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0',
                  padding: '10px 16px', borderRadius: '10px', fontSize: '13px',
                  fontWeight: '600', animation: 'fadeIn 0.2s ease'
                }}>
                  <span style={{ fontSize: '16px' }}>✅</span>
                  {horarioFormSuccess}
                </div>
              )}
            </div>

            <div className="schedules-layout">
              {/* PANEL DE REGISTRO */}
              <div className="panel-card">
                <div className="panel-header">
                  <h3>Nuevo Horario</h3>
                </div>

                <form onSubmit={crearHorario} style={{ marginTop: '12px' }}>
                  {horarioFormError && <div className="alert-error">{horarioFormError}</div>}

                  {/* DOCTOR SELECT */}
                  <div className="form-group">
                    <label htmlFor="hor-doctor">Doctor</label>
                    <select
                      id="hor-doctor"
                      name="doctorId"
                      className="form-input"
                      value={horarioForm.doctorId}
                      onChange={handleHorarioFormChange}
                      required
                    >
                      <option value="">— Seleccionar Doctor —</option>
                      {doctors.map((doc) => (
                        <option key={doc._id} value={doc._id}>
                          {doc.userId?.name || doc.name}
                          {doc.specialty ? ` • ${doc.specialty}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* FICHA DEL DOCTOR SELECCIONADO */}
                  {selectedHorarioDoctor && (
                    <div style={{
                      background: '#f0f9ff', border: '1px solid #bae6fd',
                      borderRadius: '10px', padding: '12px 14px', marginBottom: '14px',
                      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px'
                    }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '10px', fontWeight: '700', color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Doctor</p>
                        <p style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: '600', color: '#0c4a6e' }}>
                          {selectedHorarioDoctor.userId?.name || selectedHorarioDoctor.name}
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '10px', fontWeight: '700', color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Especialidad</p>
                        <p style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: '600', color: '#0c4a6e' }}>
                          {selectedHorarioDoctor.specialty || '—'}
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '10px', fontWeight: '700', color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Consultorio</p>
                        <p style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: '600', color: '#0c4a6e' }}>
                          {selectedHorarioDoctor.office || '—'}
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '10px', fontWeight: '700', color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Email</p>
                        <p style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: '600', color: '#0c4a6e', wordBreak: 'break-all' }}>
                          {selectedHorarioDoctor.userId?.email || '—'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* DÍA */}
                  <div className="form-group">
                    <label htmlFor="hor-day">Día de atención</label>
                    <select
                      id="hor-day"
                      name="day"
                      className="form-input"
                      value={horarioForm.day}
                      onChange={handleHorarioFormChange}
                      required
                    >
                      <option value="">— Seleccionar Día —</option>
                      {['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].map(d => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* HORAS en grid 2 columnas */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="hor-start">Hora de inicio</label>
                      <select
                        id="hor-start"
                        name="startTime"
                        className="form-input"
                        value={horarioForm.startTime}
                        onChange={handleHorarioFormChange}
                        required
                      >
                        <option value="">--:--</option>
                        {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="hor-end">Hora de fin</label>
                      <select
                        id="hor-end"
                        name="endTime"
                        className="form-input"
                        value={horarioForm.endTime}
                        onChange={handleHorarioFormChange}
                        required
                      >
                        <option value="">--:--</option>
                        {timeSlots
                          .filter(t => !horarioForm.startTime || t > horarioForm.startTime)
                          .map(t => <option key={t} value={t}>{t}</option>)
                        }
                      </select>
                    </div>
                  </div>

                  {/* PREVIEW de duración */}
                  {horarioForm.startTime && horarioForm.endTime && (
                    <div style={{
                      marginTop: '10px', background: '#f8fafc', borderRadius: '8px',
                      padding: '8px 12px', fontSize: '12px', color: '#475569',
                      display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                      <span style={{ fontSize: '14px' }}>⏱</span>
                      <span>
                        <strong style={{ color: '#0f172a' }}>{horarioForm.startTime}</strong> hasta <strong style={{ color: '#0f172a' }}>{horarioForm.endTime}</strong>
                        {' — '}
                        <strong style={{ color: '#2563eb' }}>
                          {(() => {
                            const [sh, sm] = horarioForm.startTime.split(':').map(Number);
                            const [eh, em] = horarioForm.endTime.split(':').map(Number);
                            const diff = (eh * 60 + em) - (sh * 60 + sm);
                            if (diff <= 0) return 'rango inválido';
                            const hrs = Math.floor(diff / 60);
                            const mins = diff % 60;
                            return hrs > 0
                              ? `${hrs}h${mins > 0 ? ` ${mins}min` : ''} de atención`
                              : `${mins}min de atención`;
                          })()}
                        </strong>
                      </span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="form-submit-btn w-full"
                    style={{ marginTop: '16px', opacity: horarioSubmitting ? 0.65 : 1, cursor: horarioSubmitting ? 'not-allowed' : 'pointer' }}
                    disabled={horarioSubmitting}
                  >
                    {horarioSubmitting ? 'Guardando...' : '+ Crear Horario'}
                  </button>
                </form>
              </div>

              {/* LISTADO DE HORARIOS */}
              <div>
                <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>
                    {horarios.length} horario{horarios.length !== 1 ? 's' : ''} registrado{horarios.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {loading ? (
                  <div className="empty-state">Cargando horarios...</div>
                ) : horarios.length === 0 ? (
                  <div className="empty-state">No hay horarios registrados.</div>
                ) : (
                  <div className="schedules-list">
                    {horarios.map((horario) => {
                      const docName = horario.doctorId?.userId?.name || horario.doctorId?.name || 'Doctor';
                      const docSpecialty = horario.doctorId?.specialty || horario.doctorId?.speciality || '';
                      const docOffice = horario.doctorId?.office || '';
                      const initials = docName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
                      return (
                        <article key={horario._id} className="schedule-card">
                          {/* Cabecera del doctor */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="avatar-circle" style={{ background: '#2563eb', flexShrink: 0, width: '38px', height: '38px', fontSize: '13px' }}>
                              {initials}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ margin: 0, fontWeight: '700', fontSize: '14px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {docName}
                              </p>
                              {docSpecialty && (
                                <p style={{ margin: '1px 0 0', fontSize: '11px', color: '#64748b' }}>{docSpecialty}</p>
                              )}
                            </div>
                          </div>

                          {/* Detalles del horario */}
                          <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '10px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <div>
                              <p style={{ margin: 0, fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Día</p>
                              <p style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: '700', color: '#2563eb' }}>{horario.day}</p>
                            </div>
                            <div>
                              <p style={{ margin: 0, fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Horario</p>
                              <p style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{horario.startTime} – {horario.endTime}</p>
                            </div>
                            {docOffice && (
                              <div style={{ gridColumn: '1 / -1' }}>
                                <p style={{ margin: 0, fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Consultorio</p>
                                <p style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{docOffice}</p>
                              </div>
                            )}
                          </div>

                          <div className="schedule-actions">
                            <button
                              onClick={() => eliminarHorario(horario._id)}
                              className="btn-delete-schedule"
                              type="button"
                            >
                              Eliminar
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'especialidades': {
        const doctoresConPerfil = doctors.filter(d => d.specialty || d.speciality);

        return (
          <section className="appointments-section fade-in">
            <div className="section-header">
              <div>
                <span className="eyebrow">Catálogo</span>
                <h2>Especialidades Médicas</h2>
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', background: '#f1f5f9', padding: '6px 14px', borderRadius: '8px' }}>
                {doctoresConPerfil.length} doctor{doctoresConPerfil.length !== 1 ? 'es' : ''} registrado{doctoresConPerfil.length !== 1 ? 'es' : ''}
              </span>
            </div>

            {loading ? (
              <div className="empty-state">Cargando especialidades...</div>
            ) : doctoresConPerfil.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🩺</div>
                <div>No hay doctores con especialidad registrada.</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Completa los perfiles de los doctores en la sección "Doctores" para verlos aquí.</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginTop: '10px' }}>
                {doctoresConPerfil.map((d) => {
                  const nombre = d.userId?.name || d.name || 'Doctor';
                  const especialidad = d.specialty || d.speciality || 'Sin especialidad';
                  const consultorio = d.office || 'No asignado';
                  const licencia = d.licenseNumber || 'No registrada';
                  const email = d.userId?.email || 'Sin correo electrónico';
                  const initials = nombre.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

                  return (
                    <article key={d._id} style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(0, 0, 0, 0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                    >
                      {/* Línea decorativa superior */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #2563eb, #3b82f6)'
                      }} />

                      {/* Info Doctor y Especialidad */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: '#eff6ff',
                          color: '#2563eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '700',
                          fontSize: '16px',
                          border: '1px solid #dbeafe',
                          flexShrink: 0
                        }}>
                          {initials}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {nombre}
                          </h4>
                          <span style={{
                            display: 'inline-block',
                            marginTop: '4px',
                            background: '#dbeafe',
                            color: '#1e40af',
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px'
                          }}>
                            {especialidad}
                          </span>
                        </div>
                      </div>

                      {/* Detalles del Perfil */}
                      <div style={{
                        background: '#f8fafc',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        fontSize: '13px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#64748b', fontWeight: '500' }}>Consultorio:</span>
                          <span style={{ color: '#0f172a', fontWeight: '700' }}>{consultorio}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#64748b', fontWeight: '500' }}>Licencia (CMP):</span>
                          <span style={{ color: '#334155', fontWeight: '600' }}>{licencia}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#64748b', fontWeight: '500' }}>Contacto:</span>
                          <span style={{ color: '#64748b', fontSize: '12px', wordBreak: 'break-all', textAlign: 'right' }}>{email}</span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        );
      }


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

      case 'estadisticas': {
        const totalCitas = citas.length;
        const completadas = citas.filter(c => c.status === 'completada').length;
        const canceladas = citas.filter(c => c.status === 'cancelada').length;

        const calcPercent = (val) => {
          if (!totalCitas) return '0%';
          return `${Math.round((val / totalCitas) * 100)}%`;
        };

        // Ordenar citas por fecha más reciente
        const ultimasCitas = [...citas]
          .filter(c => c.date)
          .sort((a, b) => (b.date + ' ' + (b.startTime || '')).localeCompare(a.date + ' ' + (a.startTime || '')))
          .slice(0, 10);

        return (
          <section className="appointments-section fade-in">
            <div className="section-header">
              <div>
                <span className="eyebrow">Reportes</span>
                <h2>Estadísticas Generales</h2>
              </div>
            </div>

            {/* Grid superior de métricas principales */}
            <div className="stats-section" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <article className="stat-card" style={{ borderLeft: '4px solid #3b82f6' }}>
                <strong>{totalCitas}</strong>
                <span>Citas registradas</span>
              </article>
              <article className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
                <strong>{summary.pending}</strong>
                <span>Pendientes</span>
                <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{calcPercent(summary.pending)} del total</span>
              </article>
              <article className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
                <strong>{completadas}</strong>
                <span>Completadas</span>
                <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{calcPercent(completadas)} del total</span>
              </article>
              <article className="stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
                <strong>{canceladas}</strong>
                <span>Canceladas</span>
                <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{calcPercent(canceladas)} del total</span>
              </article>
            </div>

            {/* Grid inferior de otros recursos */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', background: '#eff6ff', color: '#2563eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🩺</div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Doctores activos</h4>
                  <p style={{ margin: '2px 0 0', fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>{doctors.length}</p>
                </div>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', background: '#fef2f2', color: '#dc2626', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📅</div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Horarios registrados</h4>
                  <p style={{ margin: '2px 0 0', fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>{horarios.length}</p>
                </div>
              </div>
            </div>

            {/* Listado de últimas citas */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', marginTop: '24px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>Últimas Citas Registradas</h3>
              
              {ultimasCitas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '13px' }}>
                  No hay citas registradas en el sistema.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <th style={{ padding: '10px 12px', color: '#475569', fontWeight: '700' }}>Paciente</th>
                        <th style={{ padding: '10px 12px', color: '#475569', fontWeight: '700' }}>Doctor</th>
                        <th style={{ padding: '10px 12px', color: '#475569', fontWeight: '700' }}>Fecha</th>
                        <th style={{ padding: '10px 12px', color: '#475569', fontWeight: '700' }}>Horario</th>
                        <th style={{ padding: '10px 12px', color: '#475569', fontWeight: '700' }}>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ultimasCitas.map((cita) => {
                        const pacName = cita.patientId?.name || 'Paciente';
                        const docName = cita.doctorId?.userId?.name || cita.doctorId?.name || 'Doctor';
                        const fecha = cita.date ? new Date(cita.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
                        return (
                          <tr key={cita._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '12px', fontWeight: '600', color: '#0f172a' }}>{pacName}</td>
                            <td style={{ padding: '12px', color: '#2563eb', fontWeight: '500' }}>{docName}</td>
                            <td style={{ padding: '12px', color: '#475569' }}>{fecha}</td>
                            <td style={{ padding: '12px', fontWeight: '600', color: '#1e293b' }}>{cita.startTime || '—'}</td>
                            <td style={{ padding: '12px' }}>
                              <span className={`status-badge ${cita.status}`} style={{ margin: 0 }}>
                                {cita.status ? cita.status.charAt(0).toUpperCase() + cita.status.slice(1) : ''}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        );
      }

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