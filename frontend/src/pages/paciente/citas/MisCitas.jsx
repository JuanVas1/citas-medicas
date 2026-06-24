import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, X, CalendarX2 } from 'lucide-react';
import { citaService } from '../../../services/citaService';

const ESTADO_STYLES = {
  pendiente: 'bg-amber-50 text-amber-700',
  confirmada: 'bg-green-50 text-green-700',
  cancelada: 'bg-red-50 text-red-700',
  completada: 'bg-gray-100 text-gray-600',
};

const formatFecha = (isoDate) => {
  if (!isoDate) return '-';
  const [y, m, d] = isoDate.split('-');
  if (!y || !m || !d) return isoDate;
  return `${d}/${m}/${y}`;
};

const toDateTime = (date, time) => {
  if (!date || !time) return null;
  return new Date(`${date}T${time}:00`);
};

const canModifyOrCancel = (cita) => {
  const status = (cita.status || '').toLowerCase();
  const allowedStatus = ['pendiente', 'confirmada'].includes(status);
  if (!allowedStatus) {
    return {
      allowed: false,
      reason: 'Solo estado Pendiente o Confirmada'
    };
  }

  const appointmentDate = toDateTime(cita.date, cita.startTime);
  if (!appointmentDate || Number.isNaN(appointmentDate.getTime())) {
    return {
      allowed: false,
      reason: 'Fecha u hora invalida'
    };
  }

  const hours = (appointmentDate.getTime() - Date.now()) / (1000 * 60 * 60);
  if (hours <= 24) {
    return {
      allowed: false,
      reason: 'Menos de 24 horas para la cita'
    };
  }

  return { allowed: true, reason: '' };
};

const normalizeAppointment = (raw) => {
  const doctor = raw.doctorId?.userId?.name || raw.doctorId?.name || raw.doctorNombre || 'Doctor';
  const specialty = raw.doctorId?.specialty || raw.especialidad || '-';

  return {
    id: raw._id || raw.id,
    doctorNombre: doctor,
    especialidad: specialty,
    fecha: raw.date || raw.fecha,
    hora: raw.startTime || raw.hora,
    estado: raw.status || raw.estado,
    date: raw.date || raw.fecha,
    startTime: raw.startTime || raw.hora,
    status: raw.status || raw.estado
  };
};

const MisCitas = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelandoId, setCancelandoId] = useState(null);
  const navigate = useNavigate();

  const cargarCitas = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await citaService.getMine();
      const normalized = (Array.isArray(res.data) ? res.data : []).map(normalizeAppointment);
      setCitas(normalized);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudieron cargar tus citas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const onModificar = (id) => {
    navigate(`/paciente/citas/editar/${id}`); // CU-05: ajusta esta ruta a la que tengas para EditarCita.jsx
  };

  const onCancelar = async (id) => {
    const confirmar = window.confirm('¿Seguro que deseas cancelar esta cita?');
    if (!confirmar) return;

    setCancelandoId(id);
    try {
      await citaService.cancelMine(id);
      setCitas((prev) =>
        prev.map((c) => (c.id === id ? { ...c, estado: 'cancelada', status: 'cancelada' } : c))
      );
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo cancelar la cita');
    } finally {
      setCancelandoId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f8fd] px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-900">Mis Citas</h1>
        <p className="mt-1 text-sm text-gray-500">
          Consulta, modifica o cancela tus citas programadas.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3">Doctor</th>
                <th className="px-5 py-3">Fecha</th>
                <th className="px-5 py-3">Hora</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                    Cargando tus citas...
                  </td>
                </tr>
              )}

              {!loading && citas.length === 0 && !error && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <CalendarX2 size={28} className="text-gray-300" />
                      No tienes citas registradas todavía.
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                citas.map((cita) => {
                  const estadoLower = cita.estado?.toLowerCase();
                  const reglas = canModifyOrCancel(cita);
                  const puedeEditar = reglas.allowed;

                  return (
                    <tr key={cita.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-800">{cita.doctorNombre}</div>
                        <div className="text-xs text-gray-400">{cita.especialidad}</div>
                      </td>
                      <td className="px-5 py-4 text-gray-700">{formatFecha(cita.fecha)}</td>
                      <td className="px-5 py-4 text-gray-700">{cita.hora}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                            ESTADO_STYLES[estadoLower] || 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {cita.estado}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onModificar(cita.id)}
                            disabled={!puedeEditar}
                            title={!puedeEditar ? reglas.reason : 'Modificar cita'}
                            className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-[#1565D8] hover:text-[#1565D8] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Pencil size={13} />
                            Modificar
                          </button>
                          <button
                            type="button"
                            onClick={() => onCancelar(cita.id)}
                            disabled={!puedeEditar || cancelandoId === cita.id}
                            title={!puedeEditar ? reglas.reason : 'Cancelar cita'}
                            className="flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <X size={13} />
                            {cancelandoId === cita.id ? 'Cancelando...' : 'Cancelar'}
                          </button>
                        </div>
                        {!puedeEditar && (
                          <p className="mt-2 text-right text-[11px] text-gray-400">{reglas.reason}</p>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default MisCitas;