import React, { useEffect, useState } from 'react';
import { consultorioService } from '../../services/consultorioService';

const GestionConsultorios = () => {
  const [consultorios, setConsultorios] = useState([]);
  const [form, setForm] = useState({ numero: '', piso: '', especialidad: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    cargarConsultorios();
  }, []);

  const cargarConsultorios = async () => {
    try {
      const response = await consultorioService.getAll();
      setConsultorios(response.data);
    } catch (err) {
      console.error(err);
      setConsultorios([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const crearConsultorio = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.numero || !form.piso || !form.especialidad) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      await consultorioService.create(form);
      setForm({ numero: '', piso: '', especialidad: '' });
      cargarConsultorios();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear consultorio');
    }
  };

  const toggleActivo = async (id) => {
    try {
      await consultorioService.toggleActivo(id);
      cargarConsultorios();
    } catch (err) {
      console.error(err);
    }
  };

  const eliminarConsultorio = async (id) => {
    try {
      await consultorioService.deleteConsultorio(id);
      cargarConsultorios();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Gestión de Consultorios</h1>

        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Registrar Consultorio</h2>
          {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <form onSubmit={crearConsultorio} className="grid gap-4 md:grid-cols-3">
            <input
              name="numero"
              placeholder="Número"
              value={form.numero}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />
            <input
              name="piso"
              placeholder="Piso"
              value={form.piso}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />
            <input
              name="especialidad"
              placeholder="Especialidad"
              value={form.especialidad}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />
            <button type="submit" className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700">
              Crear Consultorio
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Consultorios Registrados</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-left">
                  <th className="p-3">Número</th>
                  <th className="p-3">Piso</th>
                  <th className="p-3">Especialidad</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {consultorios.map((consultorio) => (
                  <tr key={consultorio._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{consultorio.numero}</td>
                    <td className="p-3">{consultorio.piso}</td>
                    <td className="p-3">{consultorio.especialidad}</td>
                    <td className="p-3">{consultorio.activo ? 'Activo' : 'Inactivo'}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => toggleActivo(consultorio._id)}
                        className="rounded-lg bg-yellow-500 px-3 py-2 text-white hover:bg-yellow-600"
                      >
                        {consultorio.activo ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => eliminarConsultorio(consultorio._id)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700"
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
      </div>
    </main>
  );
};

export default GestionConsultorios;
