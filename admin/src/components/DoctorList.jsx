import React from 'react';

export default function DoctorList({ doctors }) {
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
