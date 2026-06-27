import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(form);
      navigate('/doctor');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Iniciar sesión</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="space-y-4">
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Correo"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Contraseña"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg mt-6" type="submit">
          Entrar
        </button>
      </form>
    </main>
  );
};

export default Login;
