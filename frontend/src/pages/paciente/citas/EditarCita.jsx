import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CalendarDays, Clock, FileText, ArrowLeft, Loader2 } from 'lucide-react';
import { citaService } from '../../../services/citaService';

const toDateTime = (date, time) => {
  if (!date || !time) return null;
  return new Date(`${date}T${time}:00`);
};

const addMinutesToTime = (time, minutes) => {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return '';

  const total = h * 60 + m + minutes;
  const normalized = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const hh = String(Math.floor(normalized / 60)).padStart(2, '0');
  const mm = String(normalized % 60).padStart(2, '0');
  return `${hh}:${mm}`;
};

const canReschedule = (appointment) => {
  const status = (appointment.status || '').toLowerCase();
  if (!['pendiente', 'confirmada'].includes(status)) {
    return {
      allowed: false,
      reason: 'Solo puedes reprogramar citas en estado Pendiente o Confirmada.'
    };
  }

  const appointmentDate = toDateTime(appointment.date, appointment.startTime);
  if (!appointmentDate || Number.isNaN(appointmentDate.getTime())) {
    return {
      allowed: false,
      reason: 'La cita tiene fecha u hora invalida.'
    };
  }

  const diffHours = (appointmentDate.getTime() - Date.now()) / (1000 * 60 * 60);
  if (diffHours <= 24) {
    return {
      allowed: false,
      reason: 'Solo puedes reprogramar con mas de 24 horas de anticipacion.'
    };
  }

  return { allowed: true, reason: '' };
};

const EditarCita = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fecha: '', hora: '', motivo: '' });
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [restriccion, setRestriccion] = useState('');
  const [citaActual, setCitaActual] = useState(null);

  useEffect(() => {
    const cargarCita = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await citaService.getById(id);
        const data = res.data || {};
        setCitaActual(data);
        setForm({
          fecha: data.date || '',
          hora: data.startTime || '',
          motivo: data.reason || ''
        });

        const rule = canReschedule(data);
        if (!rule.allowed) {
          setRestriccion(rule.reason);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'No se pudo cargar la cita');
      } finally {
        setLoading(false);
      }
    };

    cargarCita();
  }, [id]);

  const onChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setExito(false);
    setGuardando(true);

    if (restriccion) {
      setError(restriccion);
      setGuardando(false);
      return;
    }

    const nextDate = toDateTime(form.fecha, form.hora);
    if (!nextDate || Number.isNaN(nextDate.getTime())) {
      setError('Fecha u hora invalida');
      setGuardando(false);
      return;
    }

    const diffHours = (nextDate.getTime() - Date.now()) / (1000 * 60 * 60);
    if (diffHours <= 24) {
      setError('La nueva fecha debe ser con mas de 24 horas de anticipacion');
      setGuardando(false);
      return;
    }

    try {
      const payload = {
        date: form.fecha,
        startTime: form.hora,
        endTime: citaActual?.endTime || addMinutesToTime(form.hora, 30),
        reason: form.motivo
      };

      await citaService.rescheduleMine(id, payload);
      setExito(true);
      setTimeout(() => navigate('/paciente/citas'), 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo actualizar la cita');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f8fd] px-4 py-10">
      <div className="mx-auto max-w-md">
        <Link
          to="/paciente/citas"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#1565D8]"
        >
          <ArrowLeft size={15} />
          Volver a mis citas
        </Link>

        <div className="rounded-2xl border border-gray-100 bg-white px-8 py-9 shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">Modificar Cita</h1>
          <p className="mt-1 text-sm text-gray-500">
            Cambia la fecha, hora o motivo de tu cita.
          </p>

          {restriccion && (
            <p className="mt-4 rounded-xl bg-amber-50 px-3.5 py-2.5 text-sm text-amber-700">
              {restriccion}
            </p>
          )}

          {loading ? (
            <p className="mt-8 text-sm text-gray-400">Cargando datos de la cita...</p>
          ) : (
            <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-5">
              <div>
                <label htmlFor="fecha" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Fecha
                </label>
                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="fecha"
                    name="fecha"
                    type="date"
                    value={form.fecha}
                    onChange={onChange}
                    required
                    disabled={!!restriccion}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-3 pl-11 pr-3 text-sm text-gray-900 outline-none transition focus:border-[#1565D8] focus:bg-white focus:ring-2 focus:ring-[#1565D8]/15"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="hora" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Hora
                </label>
                <div className="relative">
                  <Clock
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="hora"
                    name="hora"
                    type="time"
                    value={form.hora}
                    onChange={onChange}
                    required
                    disabled={!!restriccion}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-3 pl-11 pr-3 text-sm text-gray-900 outline-none transition focus:border-[#1565D8] focus:bg-white focus:ring-2 focus:ring-[#1565D8]/15"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="motivo" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Motivo
                </label>
                <div className="relative">
                  <FileText
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-3.5 text-gray-400"
                  />
                  <textarea
                    id="motivo"
                    name="motivo"
                    rows={3}
                    value={form.motivo}
                    onChange={onChange}
                    placeholder="Describe brevemente el motivo de tu consulta"
                    required
                    disabled={!!restriccion}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/60 py-3 pl-11 pr-3 text-sm text-gray-900 outline-none transition focus:border-[#1565D8] focus:bg-white focus:ring-2 focus:ring-[#1565D8]/15"
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-600">{error}</p>
              )}

              {exito && (
                <p className="rounded-xl bg-green-50 px-3.5 py-2.5 text-sm text-green-700">
                  Cita actualizada correctamente. Redirigiendo...
                </p>
              )}

              <button
                type="submit"
                disabled={guardando || !!restriccion}
                className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-[#1565D8] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-[#1153b8] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {guardando && <Loader2 size={16} className="animate-spin" />}
                {guardando ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default EditarCita;