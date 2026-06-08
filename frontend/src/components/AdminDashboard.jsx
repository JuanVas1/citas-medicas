import React, { useState, useEffect } from 'react';
import { appointmentService, doctorService } from '../services';

export default function AdminDashboard({ user, onLogout }) {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewDoctor, setShowNewDoctor] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    speciality: 'Cardiología',
    phone: '',
    email: '',
    licenseNumber: ''
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

  const handleDoctorChange = (e) => {
    const { name, value } = e.target;
    setDoctorForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      await doctorService.create(doctorForm);
      setDoctorForm({
        name: '',
        speciality: 'Cardiología',
        phone: '',
        email: '',
        licenseNumber: ''
      });
      setShowNewDoctor(false);
      loadData();
    } catch (err) {
      console.error('Error creando doctor:', err);
    }
  };

  const handleUpdateAppointment = async (appointmentId, status) => {
    try {
      await appointmentService.update(appointmentId, { status });
      loadData();
    } catch (err) {
      console.error('Error actualizando cita:', err);
    }
  };

  return (
    <div className="dashboard admin-dashboard">
      <header className="dashboard-header">
        <h1>Panel del Administrador</h1>
        <div className="user-info">
          <span>Bienvenido, {user.name}</span>
          <button onClick={onLogout}>Cerrar Sesión</button>
        </div>
      </header>

      <main className="dashboard-content">
        {/* Sección de Citas */}
        <section className="appointments-section">
          <h2>Gestión de Citas Médicas</h2>
          <div className="appointments-list">
            {loading ? (
              <p>Cargando...</p>
            ) : appointments.length === 0 ? (
              <p>No hay citas agendadas</p>
            ) : (
              appointments.map(apt => (
                <div key={apt._id} className="appointment-card admin">
                  <div className="appointment-info">
                    <h3>{apt.doctorId.name}</h3>
                    <p><strong>Paciente:</strong> {apt.clientId.name}</p>
                    <p><strong>Email:</strong> {apt.clientId.email}</p>
                    <p><strong>Teléfono:</strong> {apt.clientId.phone}</p>
                    <p><strong>Especialidad:</strong> {apt.doctorId.speciality}</p>
                    <p><strong>Fecha:</strong> {new Date(apt.date).toLocaleDateString()}</p>
                    <p><strong>Hora:</strong> {apt.time}</p>
                    <p><strong>Motivo:</strong> {apt.reason}</p>
                    <p><strong>Estado:</strong> <span className={`status ${apt.status}`}>{apt.status}</span></p>
                  </div>
                  <div className="appointment-actions">
                    <button 
                      onClick={() => handleUpdateAppointment(apt._id, 'confirmada')}
                      className="btn-success"
                    >
                      Confirmar
                    </button>
                    <button 
                      onClick={() => handleUpdateAppointment(apt._id, 'completada')}
                      className="btn-info"
                    >
                      Completada
                    </button>
                    <button 
                      onClick={() => handleUpdateAppointment(apt._id, 'cancelada')}
                      className="btn-danger"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Sección de Doctores */}
        <section className="doctors-section">
          <div className="section-header">
            <h2>Gestión de Doctores</h2>
            <button onClick={() => setShowNewDoctor(!showNewDoctor)} className="btn-primary">
              {showNewDoctor ? 'Cancelar' : 'Nuevo Doctor'}
            </button>
          </div>

          {showNewDoctor && (
            <form onSubmit={handleAddDoctor} className="doctor-form">
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="name"
                  value={doctorForm.name}
                  onChange={handleDoctorChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Especialidad:</label>
                <select
                  name="speciality"
                  value={doctorForm.speciality}
                  onChange={handleDoctorChange}
                >
                  <option>Cardiología</option>
                  <option>Dermatología</option>
                  <option>Pediatría</option>
                  <option>Oftalmología</option>
                  <option>Neurología</option>
                  <option>Psicología</option>
                  <option>Generales</option>
                </select>
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={doctorForm.email}
                  onChange={handleDoctorChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Teléfono:</label>
                <input
                  type="tel"
                  name="phone"
                  value={doctorForm.phone}
                  onChange={handleDoctorChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Número de Licencia:</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={doctorForm.licenseNumber}
                  onChange={handleDoctorChange}
                  required
                />
              </div>
              <button type="submit" className="btn-primary">Agregar Doctor</button>
            </form>
          )}

          <div className="doctors-list">
            {doctors.map(doc => (
              <div key={doc._id} className="doctor-card">
                <h3>{doc.name}</h3>
                <p><strong>Especialidad:</strong> {doc.speciality}</p>
                <p><strong>Email:</strong> {doc.email}</p>
                <p><strong>Teléfono:</strong> {doc.phone}</p>
                <p><strong>Licencia:</strong> {doc.licenseNumber}</p>
                <p><strong>Estado:</strong> {doc.active ? 'Activo' : 'Inactivo'}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
