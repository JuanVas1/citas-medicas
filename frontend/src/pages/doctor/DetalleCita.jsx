import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { citaService } from '../../services/citaService';
import { ArrowLeft } from 'lucide-react';

// Mapa de transiciones válidas (igual que en el backend)
const VALID_TRANSITIONS = {
  pendiente:  ['confirmada', 'cancelada'],
  confirmada: ['completada', 'cancelada'],
  completada: [],
  cancelada:  []
};

const BADGE = {
  pendiente:  'bg-yellow-100 text-yellow-800',
  confirmada: 'bg-blue-100 text-blue-800',
  completada: 'bg-green-100 text-green-800',
  cancelada:  'bg-red-100 text-red-800',
};

const DetalleCita = () => {
  const { id } = useParams();
  const [cita, setCita] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCita();
  }, []);

  const cargarCita = async () => {
    try {
      const response = await citaService.getById(id);
      setCita(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (status) => {
    try {
      await citaService.updateStatus(id, { status });
      cargarCita(); // refresca los datos
    } catch (error) {
      alert(error.response?.data?.error || 'Error al cambiar estado');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 p-8 flex items-center justify-center">
        <p className="text-gray-500">Cargando información de la cita...</p>
      </main>
    );
  }

  if (!cita) {
    return (
      <main className="min-h-screen bg-slate-100 p-8 flex items-center justify-center">
        <p className="text-red-500">No se encontró la cita.</p>
      </main>
    );
  }

  const accionesDisponibles = VALID_TRANSITIONS[cita.status] || [];

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-2xl">

        {/* Volver */}
        <Link
          to="/doctor"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 transition"
        >
          <ArrowLeft size={16} />
          Volver a mi agenda
        </Link>

        <div className="bg-white rounded-2xl shadow p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Detalle de la Cita</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${BADGE[cita.status]}`}>
              {cita.status}
            </span>
          </div>

          {/* Información */}
          <div className="space-y-4 divide-y divide-slate-100">
            <div className="grid grid-cols-2 gap-4 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Paciente</p>
                <p className="mt-1 font-medium text-gray-900">{cita.patientId?.name || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Correo</p>
                <p className="mt-1 text-gray-700">{cita.patientId?.email || '—'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Fecha</p>
                <p className="mt-1 font-medium text-gray-900">{cita.date}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Horario</p>
                <p className="mt-1 text-gray-700">{cita.startTime} – {cita.endTime}</p>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Motivo de la consulta</p>
              <p className="mt-2 text-gray-700 leading-relaxed">{cita.reason}</p>
            </div>

            {cita.notes && (
              <div className="pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Notas</p>
                <p className="mt-2 text-gray-700 leading-relaxed">{cita.notes}</p>
              </div>
            )}
          </div>

          {/* Acciones — solo se muestran las transiciones válidas */}
          {accionesDisponibles.length > 0 ? (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-sm font-semibold text-gray-500 mb-3">Cambiar estado:</p>
              <div className="flex flex-wrap gap-3">

                {accionesDisponibles.includes('confirmada') && (
                  <button
                    onClick={() => cambiarEstado('confirmada')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition"
                  >
                    ✓ Confirmar cita
                  </button>
                )}

                {accionesDisponibles.includes('completada') && (
                  <button
                    onClick={() => cambiarEstado('completada')}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-xl transition"
                  >
                    ✓ Marcar como completada
                  </button>
                )}

                {accionesDisponibles.includes('cancelada') && (
                  <button
                    onClick={() => cambiarEstado('cancelada')}
                    className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-5 py-2.5 rounded-xl transition"
                  >
                    ✕ Cancelar cita
                  </button>
                )}

              </div>
            </div>
          ) : (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-sm text-gray-400 italic">
                Esta cita está en estado final y no puede modificarse.
              </p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
};

export default DetalleCita;