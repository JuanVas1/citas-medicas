import React, { useEffect, useState } from 'react';
import { doctorService } from '../../services/doctorService';

const GestionDoctores = () => {

  const [doctores, setDoctores] = useState([]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialty: '',
    office: '',
    licenseNumber: ''
  });

  useEffect(() => {
    cargarDoctores();
  }, []);

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

  const crearDoctor = async (e) => {
    e.preventDefault();

    try {

      await doctorService.create(form);

      alert('Doctor creado correctamente');

      setForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        specialty: '',
        office: '',
        licenseNumber: ''
      });

      cargarDoctores();

    } catch (error) {
      alert(error.response?.data?.error || 'Error');
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold mb-6">
          Gestión de Doctores
        </h1>

        {/* FORMULARIO */}

        <div className="bg-white p-6 rounded-xl shadow mb-8">

          <h2 className="text-xl font-semibold mb-4">
            Registrar Doctor
          </h2>

          <form
            onSubmit={crearDoctor}
            className="grid md:grid-cols-2 gap-4"
          >

            <input
              name="name"
              placeholder="Nombre"
              value={form.name}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              name="email"
              placeholder="Correo"
              value={form.email}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              name="phone"
              placeholder="Teléfono"
              value={form.phone}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              name="specialty"
              placeholder="Especialidad"
              value={form.specialty}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              name="office"
              placeholder="Consultorio"
              value={form.office}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              name="licenseNumber"
              placeholder="CMP"
              value={form.licenseNumber}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <button
              className="bg-blue-600 text-white rounded p-2"
            >
              Crear Doctor
            </button>

          </form>

        </div>

        {/* TABLA */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Doctores Registrados
          </h2>

          <table className="w-full">

            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-left">Especialidad</th>
                <th className="p-2 text-left">Consultorio</th>
              </tr>
            </thead>

            <tbody>

              {doctores.map((doctor) => (

                <tr
                  key={doctor._id}
                  className="border-b"
                >

                  <td className="p-2">
                    {doctor.userId?.name || doctor.name}
                  </td>

                  <td className="p-2">
                    {doctor.specialty || doctor.speciality}
                  </td>

                  <td className="p-2">
                    {doctor.office || '-'}
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

export default GestionDoctores;