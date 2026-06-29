import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  HeartPulse,
  Loader2,
  Stethoscope,
  Activity,
  Shield,
  CalendarCheck,
  Clock,
  UserCheck,
  CheckCircle2,
  XCircle,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/* ─── inline keyframes (reuse from Login if present, else inject) ─── */
const styleId = '__register-anim-styles';
if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
  const sheet = document.createElement('style');
  sheet.id = styleId;
  sheet.textContent = `
    @keyframes reg-gradient {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes reg-float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      33%      { transform: translateY(-18px) rotate(6deg); }
      66%      { transform: translateY(10px) rotate(-4deg); }
    }
    @keyframes reg-float-reverse {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      33%      { transform: translateY(14px) rotate(-5deg); }
      66%      { transform: translateY(-12px) rotate(3deg); }
    }
    @keyframes reg-pulse-ring {
      0%   { transform: scale(0.9); opacity: 0.6; }
      50%  { transform: scale(1.15); opacity: 0.2; }
      100% { transform: scale(0.9); opacity: 0.6; }
    }
    @keyframes reg-slide-up {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes reg-shimmer {
      0%   { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes reg-check-pop {
      0%   { transform: scale(0); opacity: 0; }
      60%  { transform: scale(1.2); }
      100% { transform: scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(sheet);
}

/* ─── floating icons data ─── */
const floatingIcons = [
  { Icon: Stethoscope,  top: '12%', left: '8%',  delay: '0s',   anim: 'reg-float',         size: 28, opacity: 0.15 },
  { Icon: Activity,     top: '25%', left: '78%', delay: '1.2s', anim: 'reg-float-reverse', size: 24, opacity: 0.12 },
  { Icon: Shield,       top: '55%', left: '15%', delay: '2.5s', anim: 'reg-float',         size: 22, opacity: 0.10 },
  { Icon: CalendarCheck,top: '72%', left: '70%', delay: '0.8s', anim: 'reg-float-reverse', size: 26, opacity: 0.14 },
  { Icon: Clock,        top: '40%', left: '85%', delay: '1.8s', anim: 'reg-float',         size: 20, opacity: 0.11 },
  { Icon: UserCheck,    top: '85%', left: '25%', delay: '3s',   anim: 'reg-float-reverse', size: 24, opacity: 0.13 },
  { Icon: HeartPulse,   top: '8%',  left: '55%', delay: '0.5s', anim: 'reg-float',         size: 22, opacity: 0.10 },
];

/* ─── password strength helper ─── */
const getPasswordStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score: 1, label: 'Débil', color: '#ef4444' };
  if (score <= 2) return { score: 2, label: 'Regular', color: '#f59e0b' };
  if (score <= 3) return { score: 3, label: 'Buena', color: '#22c55e' };
  return { score: 4, label: 'Fuerte', color: '#059669' };
};

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const pwStrength = getPasswordStrength(form.password);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (!form.name.trim()) return setError('El nombre es obligatorio');
    if (!form.email.trim()) return setError('El email es obligatorio');
    if (!form.phone.trim()) return setError('El teléfono es obligatorio');
    if (form.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres');

    setLoading(true);
    try {
      await register({ ...form, role: 'paciente' });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'No fue posible registrarte');
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8fafd] px-4">
        <div
          className="flex flex-col items-center text-center"
          style={{ animation: 'reg-slide-up 0.5s ease-out both' }}
        >
          <span
            className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"
            style={{ animation: 'reg-check-pop 0.6s ease-out 0.2s both' }}
          >
            <CheckCircle2 size={40} className="text-emerald-600" />
          </span>
          <h2 className="mt-5 text-2xl font-bold text-gray-900">¡Cuenta creada!</h2>
          <p className="mt-2 text-sm text-gray-500">
            Redirigiendo al inicio de sesión…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      {/* ═══════════  LEFT BRANDING PANEL  ═══════════ */}
      <div
        className="relative hidden lg:flex lg:w-[48%] flex-col items-center justify-center overflow-hidden px-12"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 30%, #1565D8 60%, #38bdf8 100%)',
          backgroundSize: '300% 300%',
          animation: 'reg-gradient 12s ease infinite',
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

        {/* glass orb */}
        <div
          className="absolute -top-24 -right-24 h-72 w-72 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(56,189,248,0.25) 0%, transparent 70%)',
            animation: 'reg-pulse-ring 6s ease-in-out infinite',
          }}
        />

        {/* content */}
        <div
          className="relative z-10 flex flex-col items-center text-center"
          style={{ animation: 'reg-slide-up 0.8s ease-out both' }}
        >
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20 shadow-2xl">
            <HeartPulse className="text-white" size={38} />
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white" style={{ lineHeight: 1.15 }}>
            Hospital<br />
            <span className="bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
              Digital
            </span>
          </h1>

          <p className="mt-4 max-w-xs text-sm leading-relaxed text-blue-100/80">
            Crea tu cuenta en segundos y comienza a gestionar tus citas médicas de forma fácil y segura.
          </p>

          {/* steps */}
          <ul className="mt-10 flex flex-col gap-4 text-left">
            {[
              { step: '1', text: 'Crea tu cuenta gratuita' },
              { step: '2', text: 'Busca doctores por especialidad' },
              { step: '3', text: 'Agenda tu primera cita' },
            ].map(({ step, text }, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-sm text-blue-100/90"
                style={{ animation: `reg-slide-up 0.7s ease-out ${0.3 + i * 0.15}s both` }}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/10 text-cyan-300 font-bold text-xs">
                  {step}
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.6), transparent)' }}
        />
      </div>

      {/* ═══════════  RIGHT FORM PANEL  ═══════════ */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#f8fafd] px-5 py-12">
        <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-100/50 to-transparent" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-tr from-cyan-100/40 to-transparent" />

        <div
          className="relative z-10 w-full max-w-[420px]"
          style={{ animation: 'reg-slide-up 0.65s ease-out both' }}
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
            {/* back link */}
            <Link
              to="/login"
              className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-[#1565D8]"
            >
              <ArrowLeft size={14} />
              Volver al inicio de sesión
            </Link>

            <h2 className="text-2xl font-bold text-gray-900">Crear cuenta</h2>
            <p className="mt-1.5 text-sm text-gray-500">
              Regístrate como paciente para agendar tus citas.
            </p>

            <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-4">
              {/* Name */}
              <div>
                <label htmlFor="reg-name" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Nombre completo
                </label>
                <div className="group relative">
                  <User
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#1565D8]"
                  />
                  <input
                    id="reg-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Juan Pérez"
                    value={form.name}
                    onChange={onChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#1565D8] focus:bg-white focus:shadow-md focus:shadow-blue-100/40 focus:ring-2 focus:ring-[#1565D8]/15"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <div className="group relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#1565D8]"
                  />
                  <input
                    id="reg-email"
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

              {/* Phone */}
              <div>
                <label htmlFor="reg-phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <div className="group relative">
                  <Phone
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#1565D8]"
                  />
                  <input
                    id="reg-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="(999) 123-4567"
                    value={form.phone}
                    onChange={onChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#1565D8] focus:bg-white focus:shadow-md focus:shadow-blue-100/40 focus:ring-2 focus:ring-[#1565D8]/15"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="reg-password" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="group relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#1565D8]"
                  />
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Mínimo 6 caracteres"
                    value={form.password}
                    onChange={onChange}
                    required
                    minLength={6}
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

                {/* password strength bar */}
                {form.password && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="flex flex-1 gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className="h-1.5 flex-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: pwStrength.score >= level ? pwStrength.color : '#e5e7eb',
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium" style={{ color: pwStrength.color }}>
                      {pwStrength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div
                  className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
                  style={{ animation: 'reg-slide-up 0.35s ease-out both' }}
                >
                  <XCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative mt-1 flex items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200/50 transition-all duration-200 hover:shadow-xl hover:shadow-blue-200/60 disabled:cursor-not-allowed disabled:opacity-70"
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
                {!loading && (
                  <span
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)',
                      backgroundSize: '200% 100%',
                      animation: 'reg-shimmer 3s linear infinite',
                    }}
                  />
                )}
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Creando cuenta…' : 'Crear cuenta'}
              </button>
            </form>
          </div>

          {/* Login link */}
          <p className="mt-7 text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/login"
              className="font-semibold text-[#1565D8] transition-colors hover:text-[#1153b8] hover:underline"
            >
              Iniciar sesión
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

export default Register;