import React, { useEffect, useMemo, useState } from 'react';
import { appointmentService, doctorService } from '../services';
import '../styles/Dashboard.css';

import { emptyDoctorForm, getStatusLabel } from './dashboardUtils';
import Sidebar from './Sidebar';
import StatCard from './StatCard';
import AppointmentList from './AppointmentList';
import DoctorForm from './DoctorForm';
import DoctorList from './DoctorList';

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
  
  // New state for Sidebar Navigation
  const [activeTab, setActiveTab] = useState('resumen');

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
    <div className="dashboard-layout">
      <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

      <main className="dashboard-main-content">
        <header className="main-header">
          <div className="header-titles">
            <h1>
              {activeTab === 'resumen' && 'Resumen General'}
              {activeTab === 'citas' && 'Gestión de Citas'}
              {activeTab === 'doctores' && 'Equipo Médico'}
            </h1>
            <p className="subtitle">
              {activeTab === 'resumen' && 'Vista general de las estadísticas del panel.'}
              {activeTab === 'citas' && 'Administra las citas programadas por los pacientes.'}
              {activeTab === 'doctores' && 'Agrega o visualiza los doctores en el sistema.'}
            </p>
          </div>
        </header>

        <div className="content-area">
          {(message || error) && (
            <div className={`notice ${error ? 'notice-error' : 'notice-success'}`}>
              {error || message}
            </div>
          )}

          {activeTab === 'resumen' && (
            <section className="stats-section fade-in" aria-label="Resumen del panel">
              <StatCard label="Citas totales" value={summary.total} />
              <StatCard label="Pendientes" value={summary.pending} />
              <StatCard label="Confirmadas" value={summary.confirmed} />
              <StatCard label="Doctores" value={summary.doctors} />
            </section>
          )}

          {activeTab === 'citas' && (
            <section className="appointments-section fade-in">
              <div className="section-header">
                <div>
                  <span className="eyebrow">Agenda</span>
                  <h2>Lista de Citas</h2>
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
          )}

          {activeTab === 'doctores' && (
            <section className="doctors-section fade-in">
              <div className="section-header">
                <div>
                  <span className="eyebrow">Equipo</span>
                  <h2>Directorio de Doctores</h2>
                </div>

                <button
                  onClick={() => setShowNewDoctor((isVisible) => !isVisible)}
                  className="btn-primary"
                  type="button"
                >
                  {showNewDoctor ? 'Cancelar' : '+ Nuevo doctor'}
                </button>
              </div>

              {showNewDoctor && (
                <div className="fade-in">
                  <DoctorForm
                    doctorForm={doctorForm}
                    savingDoctor={savingDoctor}
                    onChange={handleDoctorChange}
                    onSubmit={handleAddDoctor}
                  />
                </div>
              )}

              <DoctorList doctors={doctors} />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
