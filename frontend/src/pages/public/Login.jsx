import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  HeartPulse,
  Loader2,
  Stethoscope,
  Activity,
  Shield,
  CalendarCheck,
  Clock,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/* ─── inline keyframes (injected once) ─── */
const styleId = '__login-anim-styles';
if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
  const sheet = document.createElement('style');
  sheet.id = styleId;
  sheet.textContent = `
    @keyframes login-gradient {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes login-float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      33%      { transform: translateY(-18px) rotate(6deg); }
      66%      { transform: translateY(10px) rotate(-4deg); }
    }
    @keyframes login-float-reverse {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      33%      { transform: translateY(14px) rotate(-5deg); }
      66%      { transform: translateY(-12px) rotate(3deg); }
    }
    @keyframes login-pulse-ring {
      0%   { transform: scale(0.9); opacity: 0.6; }
      50%  { transform: scale(1.15); opacity: 0.2; }
      100% { transform: scale(0.9); opacity: 0.6; }
    }
    @keyframes login-slide-up {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes login-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes login-shimmer {
      0%   { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;
  document.head.appendChild(sheet);
}

/* ─── floating icons data ─── */
const floatingIcons = [
  { Icon: Stethoscope, top: '12%', left: '8%',  delay: '0s',    anim: 'login-float',         size: 28, opacity: 0.15 },
  { Icon: Activity,    top: '25%', left: '78%', delay: '1.2s',  anim: 'login-float-reverse', size: 24, opacity: 0.12 },
  { Icon: Shield,      top: '55%', left: '15%', delay: '2.5s',  anim: 'login-float',         size: 22, opacity: 0.10 },
  { Icon: CalendarCheck,top:'72%', left: '70%', delay: '0.8s',  anim: 'login-float-reverse', size: 26, opacity: 0.14 },
  { Icon: Clock,       top: '40%', left: '85%', delay: '1.8s',  anim: 'login-float',         size: 20, opacity: 0.11 },
  { Icon: UserCheck,   top: '85%', left: '25%', delay: '3s',    anim: 'login-float-reverse', size: 24, opacity: 0.13 },
  { Icon: HeartPulse,  top: '8%',  left: '55%', delay: '0.5s',  anim: 'login-float',         size: 22, opacity: 0.10 },
];

/* ─── feature bullets ─── */
const features = [
  { Icon: CalendarCheck, text: 'Agenda citas en segundos' },
  { Icon: Shield,        text: 'Datos protegidos y seguros' },
  { Icon: Clock,         text: 'Disponibilidad en tiempo real' },
];

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
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
    <main className="flex min-h-screen" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      {/* ═══════════  LEFT BRANDING PANEL  ═══════════ */}
      <div
        className="relative hidden lg:flex lg:w-[48%] flex-col items-center justify-center overflow-hidden px-12"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 30%, #1565D8 60%, #38bdf8 100%)',
          backgroundSize: '300% 300%',
          animation: 'login-gradient 12s ease infinite',
        }}
      >
        {/* floating icons */}
        {floatingIcons.map(({ Icon, top, left, delay, anim, size, opacity }, i) => (
          <span
            key={i}
            className="absolute pointer-events-none text-white"
            style={{
              top, left, opacity,
              animation: `${anim} ${6 + i * 0.7}s ease-in-out ${delay} infinite`,
            }}
          >
            <Icon size={size} />
          </span>
        ))}

        {/* glass orb top-right */}
        <div
          className="absolute -top-24 -right-24 h-72 w-72 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(56,189,248,0.25) 0%, transparent 70%)',
            animation: 'login-pulse-ring 6s ease-in-out infinite',
          }}
        />

        {/* content */}
        <div
          className="relative z-10 flex flex-col items-center text-center"
          style={{ animation: 'login-slide-up 0.8s ease-out both' }}
        >
          {/* logo */}
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20 shadow-2xl">
            <HeartPulse className="text-white" size={38} />
          </div>

          <h1
            className="text-4xl font-extrabold tracking-tight text-white"
            style={{ lineHeight: 1.15 }}
          >
            Hospital<br />
            <span className="bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
              Digital
            </span>
          </h1>

          <p className="mt-4 max-w-xs text-sm leading-relaxed text-blue-100/80">
            Tu plataforma integral para gestión de citas médicas.
            Segura, rápida y disponible 24/7.
          </p>

          {/* feature bullets */}
          <ul className="mt-10 flex flex-col gap-4">
            {features.map(({ Icon, text }, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-sm text-blue-100/90"
                style={{ animation: `login-slide-up 0.7s ease-out ${0.3 + i * 0.15}s both` }}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/10">
                  <Icon size={16} className="text-cyan-300" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.6), transparent)',
          }}
        />
      </div>

      {/* ═══════════  RIGHT FORM PANEL  ═══════════ */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#f8fafd] px-5 py-12">
        {/* subtle bg shapes */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-100/50 to-transparent" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-tr from-cyan-100/40 to-transparent" />

        <div
          className="relative z-10 w-full max-w-[420px]"
          style={{ animation: 'login-slide-up 0.65s ease-out both' }}
        >
          {/* mobile-only logo */}
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1565D8] text-white shadow-lg shadow-blue-200/50">
              <HeartPulse size={26} />
            </span>
            <span className="mt-3 text-base font-bold tracking-wide text-gray-800">
              HOSPITAL DIGITAL
            </span>
          </div>

          {/* card */}
          <div
            className="rounded-3xl border border-white/60 bg-white/80 px-8 py-10 shadow-xl shadow-gray-200/50"
            style={{ backdropFilter: 'blur(16px)' }}
          >
            <h2 className="text-2xl font-bold text-gray-900">Bienvenido de nuevo</h2>
            <p className="mt-1.5 text-sm text-gray-500">
              Inicia sesión para gestionar tus citas médicas.
            </p>

            <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
              {/* Email */}
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <div className="group relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#1565D8]"
                  />
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="tu@correo.com"
                    value={form.email}
                    onChange={onChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#1565D8] focus:bg-white focus:shadow-md focus:shadow-blue-100/40 focus:ring-2 focus:ring-[#1565D8]/15"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <a
                    href="#"
                    className="text-xs font-medium text-[#1565D8] transition-colors hover:text-[#1153b8] hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="group relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#1565D8]"
                  />
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={onChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-3 pl-11 pr-12 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#1565D8] focus:bg-white focus:shadow-md focus:shadow-blue-100/40 focus:ring-2 focus:ring-[#1565D8]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
                  style={{ animation: 'login-slide-up 0.35s ease-out both' }}
                >
                  <span className="mt-0.5 shrink-0 text-red-400">⚠</span>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative mt-2 flex items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200/50 transition-all duration-200 hover:shadow-xl hover:shadow-blue-200/60 disabled:cursor-not-allowed disabled:opacity-70"
                style={{
                  background: loading
                    ? '#4a8fd4'
                    : 'linear-gradient(135deg, #1565D8 0%, #1e88e5 50%, #42a5f5 100%)',
                  backgroundSize: '200% 200%',
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundPosition = '100% 100%';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundPosition = '0% 0%';
                }}
              >
                {/* shimmer overlay */}
                {!loading && (
                  <span
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)',
                      backgroundSize: '200% 100%',
                      animation: 'login-shimmer 3s linear infinite',
                    }}
                  />
                )}
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Ingresando…' : 'Iniciar sesión'}
              </button>
            </form>
          </div>

          {/* Register link */}
          <p className="mt-7 text-center text-sm text-gray-500">
            ¿Aún no tienes cuenta?{' '}
            <Link
              to="/register"
              className="font-semibold text-[#1565D8] transition-colors hover:text-[#1153b8] hover:underline"
            >
              Crear cuenta gratis
            </Link>
          </p>

          {/* trust badge */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <Shield size={13} />
            <span>Conexión segura · Datos encriptados</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;