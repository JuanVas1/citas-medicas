import React, { useEffect, useState } from 'react';
import { horarioService } from '../../services/horarioService';
import { doctorService } from '../../services/doctorService';

const GestionHorarios = () => {
  const [horarios, setHorarios] = useState([]);
  const [doctores, setDoctores] = useState([]);

  const [form, setForm] = useState({
    doctorId: '',
    day: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    cargarHorarios();
    cargarDoctores();
  }, []);

  const cargarHorarios = async () => {
    try {
      const response = await horarioService.getAll();
      setHorarios(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarDoctores = async () => {
    try {
      const response = await doctorService.getAll();
      setDoctores(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const crearHorario = async (e) => {
    e.preventDefault();

    try {
      await horarioService.create(form);

      setForm({
        doctorId: '',
        day: '',
        startTime: '',
        endTime: ''
      });

      cargarHorarios();

      alert('Horario creado correctamente');
    } catch (error) {
      console.error(error);
      alert('Error al crear horario');
    }
  };

  const eliminarHorario = async (id) => {
    if (!window.confirm('¿Eliminar horario?')) return;

    try {
      await horarioService.delete(id);
      cargarHorarios();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mx-auto max-w-6xl">

        <h1 className="mb-6 text-3xl font-bold" style={{ color: '#2563EB' }}>
          Gestión de Horarios
        </h1>

        <div className="mb-8 rounded-xl bg-white p-6 shadow">

          <h2 className="mb-4 text-xl font-semibold" style={{ color: '#2563EB' }}>
            Nuevo Horario
          </h2>

          <form
            onSubmit={crearHorario}
            className="grid gap-4 md:grid-cols-2"
          >

            <select
              name="doctorId"
              value={form.doctorId}
              onChange={handleChange}
              required
              className="rounded border p-3"
            >
              <option value="">
                Seleccionar Doctor
              </option>

              {doctores.map((doctor) => (
                <option
                  key={doctor._id}
                  value={doctor._id}
                >
                  {doctor.userId?.name || doctor.name}
                </option>
              ))}
            </select>

            <select
              name="day"
              value={form.day}
              onChange={handleChange}
              required
              className="rounded border p-3"
            >
              <option value="">Seleccionar Día</option>
              <option>Lunes</option>
              <option>Martes</option>
              <option>Miércoles</option>
              <option>Jueves</option>
              <option>Viernes</option>
              <option>Sábado</option>
            </select>

            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              required
              className="rounded border p-3"
            />

            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              required
              className="rounded border p-3"
            />

            <button
              type="submit"
              className="rounded p-3 text-white hover:opacity-90"
              style={{ backgroundColor: '#2563EB' }}
            >
              Crear Horario
            </button>

          </form>

        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="mb-4 text-xl font-semibold" style={{ color: '#2563EB' }}>
            Horarios Registrados
          </h2>

          <table className="w-full">

            <thead>

              <tr className="border-b bg-gray-50">
                <th className="p-3 text-left">Doctor</th>
                <th className="p-3 text-left">Día</th>
                <th className="p-3 text-left">Inicio</th>
                <th className="p-3 text-left">Fin</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>

            </thead>

            <tbody>

              {horarios.map((horario) => (

                <tr
                  key={horario._id}
                  className="border-b"
                >

                  <td className="p-3">
                    {horario.doctorId?.userId?.name ||
                     horario.doctorId?.name ||
                     'Doctor'}
                  </td>

                  <td className="p-3">
                    {horario.day}
                  </td>

                  <td className="p-3">
                    {horario.startTime}
                  </td>

                  <td className="p-3">
                    {horario.endTime}
                  </td>

                  <td className="p-3">

                    <button
                      onClick={() => eliminarHorario(horario._id)}
                      className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                    >
                      Eliminar
                    </button>

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

export default GestionHorarios;