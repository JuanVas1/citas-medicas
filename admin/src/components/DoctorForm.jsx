import React from 'react';
import { SPECIALITIES } from './dashboardUtils';

export default function DoctorForm({ doctorForm, savingDoctor, onChange, onSubmit }) {
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
