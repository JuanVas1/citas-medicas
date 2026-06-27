import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, HeartPulse, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      const savedUser = JSON.parse(localStorage.getItem('user'));
      const roleRaw = (savedUser?.role || '').toString().trim().toLowerCase();
      const role = roleRaw === 'admin' ? 'administrador' : roleRaw;

      if (role === 'paciente') navigate('/paciente');
      else if (role === 'doctor') navigate('/doctor');
      else if (role === 'administrador') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'No fue posible iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f8fd] px-4 py-12">
      {/* Manchas decorativas de fondo, sutiles */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#1565D8]/5" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-[#1565D8]/5" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1565D8] text-white shadow-lg shadow-blue-200">
            <HeartPulse size={26} />
          </span>
          <span className="mt-3 text-base font-bold tracking-wide text-gray-800">
            HOSPITAL DIGITAL
          </span>
        </div>

        {/* Tarjeta */}
        <div className="rounded-2xl border border-gray-100 bg-white px-8 py-9 shadow-xl shadow-gray-200/60">
          <h2 className="text-2xl font-bold text-gray-900">Bienvenido de nuevo</h2>
          <p className="mt-1.5 text-sm text-gray-500">
            Inicia sesión para gestionar tus citas médicas.
          </p>

          <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@correo.com"
                  value={form.email}
                  onChange={onChange}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-3 pl-11 pr-3 text-sm text-gray-900 outline-none transition focus:border-[#1565D8] focus:bg-white focus:ring-2 focus:ring-[#1565D8]/15"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <a href="#" className="text-xs font-medium text-[#1565D8] hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <Lock
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={onChange}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 py-3 pl-11 pr-11 text-sm text-gray-900 outline-none transition focus:border-[#1565D8] focus:bg-white focus:ring-2 focus:ring-[#1565D8]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-[#1565D8] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-[#1153b8] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Ingresando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Aún no tienes cuenta?{' '}
          <Link to="/register" className="font-semibold text-[#1565D8] hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;