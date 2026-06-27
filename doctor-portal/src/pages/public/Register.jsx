import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Registro</h1>
        <div className="space-y-4">
          <input className="w-full border rounded-lg px-3 py-2" placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="w-full border rounded-lg px-3 py-2" placeholder="Correo" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="w-full border rounded-lg px-3 py-2" placeholder="Contraseña" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <Link to="/login" className="inline-block mt-6 text-blue-600">Volver al inicio de sesión</Link>
      </div>
    </main>
  );
};

export default Register;
