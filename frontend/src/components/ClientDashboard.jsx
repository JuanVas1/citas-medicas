import React, { useState, useEffect } from 'react';
import { appointmentService, doctorService } from '../services';

export default function ClientDashboard({ user, onLogout }) {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appts, docs] = await Promise.all([
        appointmentService.getAll(),
        doctorService.getAll()
      ]);
      setAppointments(appts.data);
      setDoctors(docs.data);
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await appointmentService.create(formData);
      setShowForm(false);
      setFormData({ doctorId: '', date: '', time: '', reason: '' });
      loadData();
    } catch (err) {
      console.error('Error creando cita:', err);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (window.confirm('¿Deseas cancelar esta cita?')) {
      try {
        await appointmentService.cancel(appointmentId);
        loadData();
      } catch (err) {
        console.error('Error cancelando cita:', err);
      }
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Panel del Cliente</h1>
        <div className="user-info">
          <span>Bienvenido, {user.name}</span>
          <button onClick={onLogout}>Cerrar Sesión</button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="appointments-section">
          <div className="section-header">
            <h2>Mis Citas</h2>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary">
              {showForm ? 'Cancelar' : 'Nueva Cita'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="appointment-form">
              <div className="form-group">
                <label>Doctor:</label>
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un doctor</option>
                  {doctors.map(doc => (
                    <option key={doc._id} value={doc._id}>
                      {doc.name} ({doc.speciality})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Fecha:</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Hora:</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Motivo de la consulta:</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn-primary">Agendar Cita</button>
            </form>
          )}

          <div className="appointments-list">
            {loading ? (
              <p>Cargando...</p>
            ) : appointments.length === 0 ? (
              <p>No tienes citas agendadas</p>
            ) : (
              appointments.map(apt => (
                <div key={apt._id} className="appointment-card">
                  <h3>{apt.doctorId.name}</h3>
                  <p><strong>Especialidad:</strong> {apt.doctorId.speciality}</p>
                  <p><strong>Fecha:</strong> {new Date(apt.date).toLocaleDateString()}</p>
                  <p><strong>Hora:</strong> {apt.time}</p>
                  <p><strong>Motivo:</strong> {apt.reason}</p>
                  <p><strong>Estado:</strong> <span className={`status ${apt.status}`}>{apt.status}</span></p>
                  {apt.status !== 'cancelada' && apt.status !== 'completada' && (
                    <button onClick={() => handleCancel(apt._id)} className="btn-danger">
                      Cancelar Cita
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
