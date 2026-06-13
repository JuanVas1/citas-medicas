import React from 'react';
import { formatDate, getStatusLabel } from './dashboardUtils';

export default function AppointmentList({ appointments, loading, onUpdateAppointment }) {
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
