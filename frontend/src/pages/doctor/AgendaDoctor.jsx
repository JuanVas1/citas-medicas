import React, { useEffect, useState } from 'react';
import { citaService } from '../../services/citaService';
import { Link } from 'react-router-dom';

const AgendaDoctor = () => {

  const [agenda, setAgenda] = useState([]);

  useEffect(() => {
    cargarAgenda();
  }, []);

  const cargarAgenda = async () => {
    try {
      const response = await citaService.getDoctorAgenda();
      setAgenda(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold mb-6">
          Agenda Médica
        </h1>

        <div className="bg-white rounded-xl shadow p-6">

          <table className="w-full">

            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3 text-left">Paciente</th>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-left">Hora</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Acción</th>
              </tr>
            </thead>

            <tbody>

              {agenda.map((cita) => (

                <tr
                  key={cita._id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-3">
                    {cita.patientId?.name}
                  </td>

                  <td className="p-3">
                    {cita.date}
                  </td>

                  <td className="p-3">
                    {cita.startTime}
                  </td>

                  <td className="p-3">
                    {cita.status}
                  </td>

                  <td className="p-3">

                    <Link
                      to={`/doctor/cita/${cita._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Ver detalle
                    </Link>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </main>
  );
};

export default AgendaDoctor;