import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, FileText, CheckCircle } from 'lucide-react';

const formatFechaISO = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatFechaLegible = (date) => {
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'short'
  });
};

const MAPEO_DIAS = {
  'Domingo': 0, 'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4, 'Viernes': 5, 'Sábado': 6
};

const obtenerProximasFechas = (nombreDia) => {
  const targetDay = MAPEO_DIAS[nombreDia];
  if (targetDay === undefined) return [];

  const fechas = [];
  const hoy = new Date();
  
  // Buscar en los próximos 30 días las primeras 4 ocurrencias de ese día
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(hoy.getDate() + i);
    if (d.getDay() === targetDay) {
      fechas.push(new Date(d));
      if (fechas.length === 4) break;
    }
  }
  return fechas;
};

const AgendarCita = ({ isWidget } = {}) => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [allSchedules, setAllSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    startTime: '',
    endTime: '',
    reason: '',
  });

  // Turno seleccionado y fechas sugeridas
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [resDocs, resSchedules] = await Promise.all([
          fetch('http://localhost:5000/api/doctors', { headers }),
          fetch('http://localhost:5000/api/horarios', { headers })
        ]);

        const dataDocs = await resDocs.json();
        const dataSchedules = await resSchedules.json();

        setDoctors(Array.isArray(dataDocs) ? dataDocs : dataDocs.data || []);
        setAllSchedules(Array.isArray(dataSchedules) ? dataSchedules : dataSchedules.data || []);
      } catch (err) {
        console.error('Error al cargar datos de agendamiento:', err);
        setError('Error al sincronizar doctores u horarios de atención.');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // Filtrar horarios del doctor seleccionado
  const doctorSchedules = useMemo(() => {
    if (!formData.doctorId) return [];
    return allSchedules.filter(s => {
      const sDocId = s.doctorId?._id || s.doctorId;
      return sDocId === formData.doctorId;
    });
  }, [formData.doctorId, allSchedules]);

  // Fechas sugeridas para el horario de atención seleccionado
  const sugeridos = useMemo(() => {
    if (!selectedSchedule) return [];
    return obtenerProximasFechas(selectedSchedule.day);
  }, [selectedSchedule]);

  const handleDoctorChange = (e) => {
    setFormData({
      ...formData,
      doctorId: e.target.value,
      date: '',
      startTime: '',
      endTime: ''
    });
    setSelectedSchedule(null);
  };

  const handleScheduleSelect = (schedule) => {
    setSelectedSchedule(schedule);
    setFormData(prev => ({
      ...prev,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      date: '' // Limpiar fecha previa para obligar a seleccionar una sugerida
    }));
  };

  const handleDateSelect = (fechaObj) => {
    setFormData(prev => ({
      ...prev,
      date: formatFechaISO(fechaObj)
    }));
  };

  const handleReasonChange = (e) => {
    setFormData(prev => ({
      ...prev,
      reason: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!formData.doctorId || !formData.date || !formData.startTime || !formData.endTime || !formData.reason.trim()) {
      setError('Por favor completa todos los pasos del agendamiento.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al agendar la cita.');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/paciente/citas');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const mainContent = (
    <div className="mx-auto max-w-3xl rounded-2xl border border-[#e8e5dd] bg-[#fffdfb] p-8 shadow-sm">
      {/* Enlace Volver simplificado */}
      {!isWidget && (
        <Link
          to="/paciente"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-[#1565D8] transition"
        >
          <ArrowLeft size={16} />
          Volver
        </Link>
      )}

      <h1 className="text-2xl font-extrabold text-gray-900">
        Agendar Cita Médica
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Sigue los pasos interactivos para programar tu cita al instante.
      </p>

      {error && (
        <p style={{ marginTop: '16px', color: '#dc2626', background: '#fef2f2', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500' }}>
          ⚠️ {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* PASO 1: SELECCIONAR DOCTOR */}
        <div className="form-step" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
            <User size={16} style={{ color: '#2563eb' }} />
            Paso 1: Selecciona el Doctor
          </label>
          <select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleDoctorChange}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#1565D8] focus:ring-1 focus:ring-[#1565D8] focus:outline-none transition bg-white"
            style={{ fontSize: '14px' }}
          >
            <option value="">-- Selecciona un médico especialista --</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.userId?.name || doc.name} — {doc.specialty || doc.speciality || 'Especialidad'}
              </option>
            ))}
          </select>
        </div>

        {/* PASO 2: SELECCIONAR TURNO */}
        {formData.doctorId && (
          <div className="form-step fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <Clock size={16} style={{ color: '#2563eb' }} />
              Paso 2: Elige un turno de atención
            </label>

            {doctorSchedules.length === 0 ? (
              <p className="text-sm text-amber-600 bg-amber-50 border border-amber-100 rounded-xl p-4">
                Este médico no tiene horarios de atención programados en el sistema por el administrador.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {doctorSchedules.map((schedule) => {
                  const isSelected = selectedSchedule?._id === schedule._id;
                  return (
                    <button
                      key={schedule._id}
                      type="button"
                      onClick={() => handleScheduleSelect(schedule)}
                      style={{
                        background: isSelected ? '#eff6ff' : '#fffdfb',
                        border: isSelected ? '2px solid #2563eb' : '1px solid #e8e5dd',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <p style={{ margin: 0, fontWeight: '700', fontSize: '14px', color: isSelected ? '#2563eb' : '#0f172a' }}>
                        {schedule.day}
                      </p>
                      <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                        ⏱ {schedule.startTime} – {schedule.endTime}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PASO 3: SELECCIONAR FECHA */}
        {selectedSchedule && (
          <div className="form-step fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <Calendar size={16} style={{ color: '#2563eb' }} />
              Paso 3: Elige la fecha de tu cita
            </label>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
              {sugeridos.map((fecha, idx) => {
                const isoDateStr = formatFechaISO(fecha);
                const isSelected = formData.date === isoDateStr;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDateSelect(fecha)}
                    style={{
                      background: isSelected ? '#eff6ff' : '#fffdfb',
                      border: isSelected ? '2px solid #2563eb' : '1px solid #e8e5dd',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: isSelected ? '#2563eb' : '#1e293b', textTransform: 'capitalize' }}>
                      {formatFechaLegible(fecha)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PASO 4: MOTIVO DE CONSULTA */}
        {formData.date && (
          <div className="form-step fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <FileText size={16} style={{ color: '#2563eb' }} />
              Paso 4: Motivo de consulta
            </label>
            <textarea
              name="reason"
              placeholder="Indica el síntoma o motivo de tu consulta médica aquí..."
              value={formData.reason}
              onChange={handleReasonChange}
              rows={3}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#1565D8] focus:ring-1 focus:ring-[#1565D8] focus:outline-none transition"
              style={{ fontSize: '14px' }}
            />
          </div>
        )}

        {/* BOTÓN SUBMIT */}
        {formData.date && (
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#1565D8] py-3.5 font-bold text-white transition hover:bg-[#0f4fb0]"
            style={{
              marginTop: '16px',
              opacity: submitting ? 0.65 : 1,
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontSize: '15px'
            }}
          >
            {submitting ? 'Agendando cita...' : '✓ Agendar Cita Médica'}
          </button>
        )}
      </form>
    </div>
  );

  if (isWidget) {
    if (success) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
          <CheckCircle size={48} style={{ color: '#16a34a', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>¡Cita Agendada Exitosamente!</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>Redirigiendo a tu bandeja de citas programadas...</p>
        </div>
      );
    }
    return mainContent;
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#faf9f5] px-4 py-10 flex items-center justify-center">
        <div className="mx-auto max-w-md rounded-2xl border border-[#e8e5dd] bg-[#fffdfb] p-8 shadow-sm text-center flex flex-col items-center gap-3">
          <CheckCircle size={44} className="text-green-600" />
          <h1 className="text-xl font-bold text-gray-900">¡Cita Solicitada!</h1>
          <p className="text-gray-500 text-sm">
            Tu cita médica ha sido registrada exitosamente. Redirigiendo a tus citas pasadas y programadas...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f5] px-4 py-10">
      {mainContent}
    </main>
  );
};

export default AgendarCita;