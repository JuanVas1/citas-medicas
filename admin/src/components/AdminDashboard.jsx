import React, { useEffect, useMemo, useState } from 'react';
import { appointmentService, doctorService } from '../services';
import '../styles/Dashboard.css';

const SPECIALITIES = [
  'Cardiologia',
  'Dermatologia',
  'Pediatria',
  'Oftalmologia',
  'Neurologia',
  'Psicologia',
  'Medicina general'
];

const STATUS_LABELS = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  completada: 'Completada',
  cancelada: 'Cancelada'
};

const emptyDoctorForm = {
  name: '',
  speciality: SPECIALITIES[0],
  phone: '',
  email: '',
  licenseNumber: ''
};

function formatDate(value) {
  if (!value) return 'Sin fecha';

  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));
}

function getStatusLabel(status) {
  return STATUS_LABELS[status] || status || 'Sin estado';
}

export default function AdminDashboard({ user, onLogout }) {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingDoctor, setSavingDoctor] = useState(false);
  const [showNewDoctor, setShowNewDoctor] = useState(false);
  const [doctorForm, setDoctorForm] = useState(emptyDoctorForm);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const summary = useMemo(() => ({
    total: appointments.length,
    pending: appointments.filter((appointment) => appointment.status === 'pendiente').length,
    confirmed: appointments.filter((appointment) => appointment.status === 'confirmada').length,
    doctors: doctors.length
  }), [appointments, doctors]);

  const filteredAppointments = useMemo(() => {
    if (filter === 'all') return appointments;
    return appointments.filter((appointment) => appointment.status === filter);
  }, [appointments, filter]);

  async function loadData() {
    try {
      setLoading(true);
      setError('');

      const [appointmentsResponse, doctorsResponse] = await Promise.all([
        appointmentService.getAll(),
        doctorService.getAll()
      ]);

      setAppointments(appointmentsResponse.data);
      setDoctors(doctorsResponse.data);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo cargar la informacion del panel.');
    } finally {
      setLoading(false);
    }
  }

  function handleDoctorChange(event) {
    const { name, value } = event.target;
    setDoctorForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));
  }

  async function handleAddDoctor(event) {
    event.preventDefault();
    setSavingDoctor(true);
    setError('');
    setMessage('');

    try {
      await doctorService.create(doctorForm);
      setDoctorForm(emptyDoctorForm);
      setShowNewDoctor(false);
      setMessage('Doctor agregado correctamente.');
      await loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear el doctor.');
    } finally {
      setSavingDoctor(false);
    }
  }

  async function handleUpdateAppointment(appointmentId, status) {
    setError('');
    setMessage('');

    try {
      await appointmentService.update(appointmentId, { status });
      setMessage(`Cita marcada como ${getStatusLabel(status).toLowerCase()}.`);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar la cita.');
    }
  }

  return (
    <div className="dashboard admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <span className="eyebrow">Administracion</span>
          <h1>Panel de citas medicas</h1>
          <p className="subtitle">Gestiona doctores, pacientes y estados de cita.</p>
        </div>

        <div className="user-info">
          <span className="user-name">{user?.name || 'Administrador'}</span>
          <button onClick={onLogout} className="btn-logout" type="button">
            Cerrar sesion
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {(message || error) && (
          <div className={`notice ${error ? 'notice-error' : 'notice-success'}`}>
            {error || message}
          </div>
        )}

        <section className="stats-section" aria-label="Resumen del panel">
          <StatCard label="Citas totales" value={summary.total} />
          <StatCard label="Pendientes" value={summary.pending} />
          <StatCard label="Confirmadas" value={summary.confirmed} />
          <StatCard label="Doctores" value={summary.doctors} />
        </section>

        <section className="appointments-section">
          <div className="section-header">
            <div>
              <span className="eyebrow">Agenda</span>
              <h2>Gestion de citas</h2>
            </div>

            <div className="filter-buttons" role="tablist" aria-label="Filtrar citas">
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

          <AppointmentList
            appointments={filteredAppointments}
            loading={loading}
            onUpdateAppointment={handleUpdateAppointment}
          />
        </section>

        <section className="doctors-section">
          <div className="section-header">
            <div>
              <span className="eyebrow">Equipo medico</span>
              <h2>Gestion de doctores</h2>
            </div>

            <button
              onClick={() => setShowNewDoctor((isVisible) => !isVisible)}
              className="btn-primary"
              type="button"
            >
              {showNewDoctor ? 'Cancelar' : 'Nuevo doctor'}
            </button>
          </div>

          {showNewDoctor && (
            <DoctorForm
              doctorForm={doctorForm}
              savingDoctor={savingDoctor}
              onChange={handleDoctorChange}
              onSubmit={handleAddDoctor}
            />
          )}

          <DoctorList doctors={doctors} />
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <article className="stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

function AppointmentList({ appointments, loading, onUpdateAppointment }) {
  if (loading) {
    return <div className="empty-state">Cargando citas...</div>;
  }

  if (appointments.length === 0) {
    return <div className="empty-state">No hay citas para mostrar.</div>;
  }

  return (
    <div className="appointments-list">
      {appointments.map((appointment) => (
        <article key={appointment._id} className="appointment-card">
          <div className="appointment-main">
            <div>
              <span className={`status-badge ${appointment.status}`}>
                {getStatusLabel(appointment.status)}
              </span>
              <h3>{appointment.doctorId?.name || 'Doctor sin asignar'}</h3>
            </div>

            <dl className="appointment-details">
              <div>
                <dt>Paciente</dt>
                <dd>{appointment.clientId?.name || 'Sin paciente'}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{appointment.clientId?.email || 'Sin email'}</dd>
              </div>
              <div>
                <dt>Telefono</dt>
                <dd>{appointment.clientId?.phone || 'Sin telefono'}</dd>
              </div>
              <div>
                <dt>Especialidad</dt>
                <dd>{appointment.doctorId?.speciality || 'Sin especialidad'}</dd>
              </div>
              <div>
                <dt>Fecha</dt>
                <dd>{formatDate(appointment.date)}</dd>
              </div>
              <div>
                <dt>Hora</dt>
                <dd>{appointment.time || 'Sin hora'}</dd>
              </div>
              <div className="full-row">
                <dt>Motivo</dt>
                <dd>{appointment.reason || 'Sin motivo registrado'}</dd>
              </div>
            </dl>
          </div>

          <div className="appointment-actions">
            <button
              onClick={() => onUpdateAppointment(appointment._id, 'confirmada')}
              className="btn-action btn-confirm"
              type="button"
              disabled={appointment.status === 'confirmada'}
            >
              Confirmar
            </button>
            <button
              onClick={() => onUpdateAppointment(appointment._id, 'completada')}
              className="btn-action btn-complete"
              type="button"
              disabled={appointment.status === 'completada'}
            >
              Completar
            </button>
            <button
              onClick={() => onUpdateAppointment(appointment._id, 'cancelada')}
              className="btn-action btn-cancel"
              type="button"
              disabled={appointment.status === 'cancelada'}
            >
              Cancelar
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function DoctorForm({ doctorForm, savingDoctor, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="doctor-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="doctor-name">Nombre</label>
          <input
            id="doctor-name"
            type="text"
            name="name"
            value={doctorForm.name}
            onChange={onChange}
            placeholder="Nombre del doctor"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="doctor-speciality">Especialidad</label>
          <select
            id="doctor-speciality"
            name="speciality"
            value={doctorForm.speciality}
            onChange={onChange}
          >
            {SPECIALITIES.map((speciality) => (
              <option key={speciality} value={speciality}>
                {speciality}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="doctor-email">Email</label>
          <input
            id="doctor-email"
            type="email"
            name="email"
            value={doctorForm.email}
            onChange={onChange}
            placeholder="doctor@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="doctor-phone">Telefono</label>
          <input
            id="doctor-phone"
            type="tel"
            name="phone"
            value={doctorForm.phone}
            onChange={onChange}
            placeholder="Numero de telefono"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="doctor-license">Numero de licencia</label>
        <input
          id="doctor-license"
          type="text"
          name="licenseNumber"
          value={doctorForm.licenseNumber}
          onChange={onChange}
          placeholder="Licencia medica"
          required
        />
      </div>

      <button type="submit" className="btn-primary" disabled={savingDoctor}>
        {savingDoctor ? 'Guardando...' : 'Agregar doctor'}
      </button>
    </form>
  );
}

function DoctorList({ doctors }) {
  if (doctors.length === 0) {
    return <div className="empty-state">Todavia no hay doctores registrados.</div>;
  }

  return (
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
              <dd>{doctor.speciality}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{doctor.email}</dd>
            </div>
            <div>
              <dt>Telefono</dt>
              <dd>{doctor.phone}</dd>
            </div>
            <div>
              <dt>Licencia</dt>
              <dd>{doctor.licenseNumber}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}
