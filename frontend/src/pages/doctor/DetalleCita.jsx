import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { citaService } from '../../services/citaService';

const DetalleCita = () => {

  const { id } = useParams();

  const [cita, setCita] = useState(null);

  useEffect(() => {
    cargarCita();
  }, []);

  const cargarCita = async () => {

    try {

      const response = await citaService.getById(id);
      setCita(response.data);

    } catch (error) {
      console.error(error);
    }

  };

  const cambiarEstado = async (status) => {

    try {

      await citaService.updateStatus(id, {
        status
      });

      cargarCita();

    } catch (error) {
      console.error(error);
    }

  };

  if (!cita) {
    return <p className="p-8">Cargando...</p>;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mx-auto max-w-3xl">

        <div className="bg-white rounded-xl shadow p-6">

          <h1 className="text-2xl font-bold mb-6">
            Detalle de la Cita
          </h1>

          <div className="space-y-3">

            <p>
              <strong>Paciente:</strong>{' '}
              {cita.patientId?.name}
            </p>

            <p>
              <strong>Email:</strong>{' '}
              {cita.patientId?.email}
            </p>

            <p>
              <strong>Fecha:</strong>{' '}
              {cita.date}
            </p>

            <p>
              <strong>Hora:</strong>{' '}
              {cita.startTime}
            </p>

            <p>
              <strong>Motivo:</strong>{' '}
              {cita.reason}
            </p>

            <p>
              <strong>Estado:</strong>{' '}
              {cita.status}
            </p>

          </div>

          <div className="flex flex-wrap gap-3 mt-8">
            {(VALID_TRANSITIONS[cita.status] || []).map((nextStatus) => (
              <button
                key={nextStatus}
                onClick={() => cambiarEstado(nextStatus)}
                className={`rounded px-4 py-2 text-white ${
                  nextStatus === 'confirmada' ? 'bg-blue-600 hover:bg-blue-700' :
                  nextStatus === 'completada' ? 'bg-green-600 hover:bg-green-700' :
                  nextStatus === 'cancelada' ? 'bg-red-600 hover:bg-red-700' :
                  'bg-gray-600'
                }`}
              >
                {nextStatus === 'confirmada' && 'Confirmar'}
                {nextStatus === 'completada' && 'Completar'}
                {nextStatus === 'cancelada' && 'Cancelar'}
              </button>
            ))}
          </div>

        </div>

      </div>

    </main>
  );
};

export default DetalleCita;