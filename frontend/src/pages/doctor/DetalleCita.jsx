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

          <div className="flex gap-3 mt-8">

            <button
              onClick={() => cambiarEstado('confirmada')}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Confirmar
            </button>

            <button
              onClick={() => cambiarEstado('completada')}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Completar
            </button>

            <button
              onClick={() => cambiarEstado('cancelada')}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>

          </div>

        </div>

      </div>

    </main>
  );
};

export default DetalleCita;