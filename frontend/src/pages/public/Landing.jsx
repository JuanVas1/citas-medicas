import { useState, useEffect, useRef } from "react";
import {
  HeartPulse,
  CalendarClock,
  BellRing,
  ShieldCheck,
  UserPlus,
  Stethoscope,
  CheckCircle2,
  Menu,
  X,
  Quote,
  ArrowRight,
  Clock,
  Star,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ─── Datos ─────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Testimonios", href: "#testimonios" },
];

const STATS = [
  { value: 5000, label: "Citas agendadas", suffix: "+" },
  { value: 120,  label: "Médicos activos", suffix: "+" },
  { value: 98,   label: "Satisfacción",    suffix: "%" },
  { value: 24,   label: "Soporte",         suffix: "/7" },
];

const FEATURES = [
  {
    icon: CalendarClock,
    title: "Citas en Línea Instantáneas",
    description: "Agenda tu consulta en menos de 2 minutos. Sin llamadas, sin filas, sin esperas innecesarias.",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    accent: "text-blue-600",
  },
  {
    icon: BellRing,
    title: "Recordatorios Automáticos",
    description: "Recibe alertas 24 horas antes de tu cita para que nunca olvides tu atención médica.",
    color: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
    accent: "text-violet-600",
  },
  {
    icon: ShieldCheck,
    title: "Datos 100% Seguros",
    description: "Tu historial médico protegido con cifrado de nivel bancario y acceso controlado.",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    accent: "text-emerald-600",
  },
  {
    icon: Clock,
    title: "Disponibilidad en Tiempo Real",
    description: "Consulta los horarios disponibles al instante y escoge el que mejor se adapta a ti.",
    color: "from-orange-500 to-amber-500",
    bg: "bg-orange-50",
    accent: "text-orange-600",
  },
];

const STEPS = [
  {
    number: "01",
    icon: UserPlus,
    title: "Crea tu cuenta",
    description: "Regístrate gratis en menos de un minuto con tu correo y datos básicos.",
  },
  {
    number: "02",
    icon: Stethoscope,
    title: "Elige tu especialista",
    description: "Busca por especialidad, revisa disponibilidad y selecciona el horario ideal.",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Confirma y listo",
    description: "Recibe confirmación inmediata y recordatorio automático antes de tu cita.",
  },
];

const TESTIMONIALS = [
  {
    name: "Lucía Fernández",
    role: "Paciente",
    initials: "LF",
    stars: 5,
    text: "Agendar mi cita tomó menos de un minuto. Los recordatorios automáticos me han salvado de varios olvidos. ¡Increíble servicio!",
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Jorge Medina",
    role: "Paciente",
    initials: "JM",
    stars: 5,
    text: "Por fin un sistema de citas médicas que no se siente complicado. La confirmación es inmediata, el diseño es muy intuitivo.",
    color: "bg-violet-100 text-violet-700",
  },
  {
    name: "Andrea Salas",
    role: "Paciente",
    initials: "AS",
    stars: 5,
    text: "Me da tranquilidad saber que mi historial médico está protegido. Lo recomiendo totalmente a toda mi familia.",
    color: "bg-emerald-100 text-emerald-700",
  },
];

/* ─── Hook: contador animado ──────────────────────────────────── */
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ─── Hook: intersection observer ────────────────────────────── */
function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ─── Stat Card ───────────────────────────────────────────────── */
function StatCard({ value, label, suffix, animate }) {
  const count = useCounter(value, 1800, animate);
  return (
    <div className="text-center">
      <p className="text-4xl font-extrabold text-white">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="mt-1 text-sm text-blue-200 font-medium">{label}</p>
    </div>
  );
}

/* ─── Navbar ──────────────────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#inicio" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md">
            <HeartPulse size={20} />
          </span>
          <span className="text-lg font-extrabold tracking-wide text-slate-900">
            MediCitas
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative transition hover:text-blue-600 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition px-4 py-2"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          >
            Registrarse gratis
          </Link>
        </div>

        <button
          aria-label="Abrir menú"
          className="text-slate-700 md:hidden p-2 rounded-xl hover:bg-slate-100 transition"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 w-full border-t border-slate-100 bg-white/98 backdrop-blur-md px-6 py-6 shadow-xl md:hidden flex flex-col gap-4 z-50">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="py-2.5 text-base font-medium text-slate-700 hover:text-blue-600 border-b border-slate-50 transition"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full border border-slate-200 py-3 text-center font-semibold text-slate-700 hover:border-blue-300 transition"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            onClick={() => setOpen(false)}
            className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-center font-bold text-white shadow-md transition"
          >
            Registrarse gratis
          </Link>
        </div>
      )}
    </header>
  );
}

/* ─── Hero ────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-16 pb-0"
    >
      {/* Orbes decorativos */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute top-10 right-10 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
        {/* Texto */}
        <div className="flex flex-col justify-center py-16 text-center md:text-left">
          <span className="inline-flex self-center md:self-start items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-400">
            <HeartPulse size={12} className="animate-pulse" />
            Sistema de Citas Médicas
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Tu salud,{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              a un clic
            </span>{" "}
            de distancia
          </h1>

          <p className="mt-6 max-w-xl text-lg text-slate-400 leading-relaxed mx-auto md:mx-0">
            Agenda citas con los mejores especialistas en segundos. Sin esperas,
            sin complicaciones. Recordatorios automáticos para que nunca pierdas
            tu cita.
          </p>

          <div className="mt-10 flex flex-wrap justify-center md:justify-start gap-4">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-900/40 transition hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            >
              Agendar cita gratis
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
            <a
              href="#como-funciona"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 hover:border-white/30"
            >
              Cómo funciona
              <ChevronDown size={16} />
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap justify-center md:justify-start items-center gap-6 text-sm text-slate-400">
            {["Sin tarjeta de crédito", "100% gratuito", "Datos seguros"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-cyan-400" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Imagen + card flotante */}
        <div className="relative flex justify-center pb-0 pt-8">
          <div className="relative w-full max-w-lg">
            {/* Glow */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-blue-500/30 to-cyan-400/20 blur-2xl" />

            {/* Imagen */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <img
                src="/hero_doctor.png"
                alt="Doctora profesional con tablet"
                className="w-full h-auto object-cover"
                style={{ maxHeight: "480px", objectPosition: "top" }}
              />
              {/* Overlay sutil */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            </div>

            {/* Card flotante: próxima cita */}
            <div className="absolute -bottom-5 -left-6 rounded-2xl bg-white p-4 shadow-2xl border border-slate-100 flex items-center gap-3 min-w-[200px]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <CalendarClock size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Próxima cita</p>
                <p className="text-sm font-bold text-slate-900">Mañana 09:00 AM</p>
              </div>
            </div>

            {/* Card flotante: disponibilidad */}
            <div className="absolute -top-4 -right-4 rounded-2xl bg-white p-3 shadow-2xl border border-slate-100 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold text-slate-700">120+ médicos disponibles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="mt-12">
        <svg viewBox="0 0 1440 80" className="w-full fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,64L60,58.7C120,53,240,43,360,42.7C480,43,600,53,720,58.7C840,64,960,64,1080,58.7C1200,53,1320,43,1380,37.3L1440,32L1440,80L0,80Z" />
        </svg>
      </div>
    </section>
  );
}

/* ─── Stats ───────────────────────────────────────────────────── */
function Stats() {
  const [ref, inView] = useInView(0.4);
  return (
    <section ref={ref} className="bg-gradient-to-r from-blue-600 to-blue-700 py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} animate={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Features ────────────────────────────────────────────────── */
function Features() {
  return (
    <section id="servicios" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Nuestros servicios
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="mt-4 text-slate-500 text-lg leading-relaxed">
            Diseñado para pacientes modernos que valoran su tiempo y su salud.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description, color, bg, accent }) => (
            <div
              key={title}
              className="group relative flex flex-col rounded-2xl border border-slate-100 bg-white p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Ícono */}
              <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${bg}`}>
                <div className={`bg-gradient-to-br ${color} h-10 w-10 flex items-center justify-center rounded-xl text-white shadow-md`}>
                  <Icon size={20} />
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>

              {/* Línea decorativa inferior al hover */}
              <div className={`absolute bottom-0 left-0 h-1 w-0 rounded-b-2xl bg-gradient-to-r ${color} transition-all duration-300 group-hover:w-full`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ────────────────────────────────────────────── */
function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Proceso sencillo
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            ¿Cómo funciona?
          </h2>
          <p className="mt-4 text-slate-500 text-lg">
            Tres pasos simples para tener tu cita médica lista.
          </p>
        </div>

        <div className="relative grid gap-8 sm:grid-cols-3">
          {/* Línea conectora decorativa */}
          <div className="absolute top-12 left-[20%] right-[20%] hidden h-0.5 border-t-2 border-dashed border-blue-200 sm:block" />

          {STEPS.map(({ number, icon: Icon, title, description }) => (
            <div key={title} className="relative flex flex-col items-center text-center z-10">
              {/* Número + Ícono */}
              <div className="relative mb-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl border border-slate-100">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-200">
                    <Icon size={28} />
                  </div>
                </div>
                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-extrabold text-white">
                  {number}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ────────────────────────────────────────────── */
function Testimonials() {
  return (
    <section id="testimonios" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Testimonios
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Lo que dicen nuestros pacientes
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map(({ name, role, initials, stars, text, color }) => (
            <figure
              key={name}
              className="relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Estrellas */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              <Quote className="text-blue-100 mb-3" size={28} />

              <blockquote className="text-sm leading-relaxed text-slate-600 italic flex-1">
                "{text}"
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-50 pt-5">
                <div className={`h-10 w-10 rounded-full ${color} flex items-center justify-center font-bold text-sm`}>
                  {initials}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{name}</div>
                  <div className="text-xs text-slate-400">{role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─────────────────────────────────────────────────────── */
function CTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-20">
      <div className="pointer-events-none absolute -top-20 left-1/4 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <HeartPulse className="mx-auto mb-6 text-cyan-400" size={40} />
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
          ¿Listo para cuidar tu salud?
        </h2>
        <p className="mt-5 text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
          Únete a miles de personas que ya gestionan sus citas médicas de forma
          inteligente, rápida y segura.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-10 py-4 text-base font-bold text-white shadow-xl shadow-blue-900/40 transition hover:opacity-90 hover:scale-[1.02]"
          >
            Crear cuenta gratuita
            <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-10 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-slate-950 py-12 border-t border-slate-900">
      <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
            <HeartPulse size={16} />
          </span>
          <span className="text-sm font-extrabold tracking-wider text-white">MediCitas</span>
        </div>
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} MediCitas. Todos los derechos reservados.
        </p>
        <div className="flex gap-6 text-xs text-slate-500">
          <a href="#inicio" className="hover:text-slate-300 transition">Privacidad</a>
          <a href="#inicio" className="hover:text-slate-300 transition">Términos</a>
          <a href="#inicio" className="hover:text-slate-300 transition">Contacto</a>
        </div>
      </div>
    </footer>
  );
}

/* ─── Export ──────────────────────────────────────────────────── */
export default function Landing() {
  return (
    <div className="min-h-screen font-sans text-slate-900 antialiased selection:bg-blue-500 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}