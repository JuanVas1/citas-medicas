import { useState } from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Sobre Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" },
];

const FEATURES = [
  {
    icon: CalendarClock,
    title: "Citas en Línea Rápidas",
    description: "Encuentra y agenda tu horario en segundos.",
  },
  {
    icon: BellRing,
    title: "Notificaciones Inteligentes",
    description: "Recordatorios automáticos y alertas por IA.",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad de Datos",
    description: "Protección de tu historial médico garantizada.",
  },
];

const STEPS = [
  {
    icon: UserPlus,
    title: "Regístrate",
    description: "Encuentra y agenda tu horario en segundos.",
  },
  {
    icon: Stethoscope,
    title: "Selecciona Médico y Horario",
    description: "Selecciona médico y horario y alertas por IA.",
  },
  {
    icon: CheckCircle2,
    title: "Confirma tu Cita",
    description: "Confirmación de tu historial médico garantizada al confirmar tu cita.",
  },
];

const TESTIMONIALS = [
  {
    name: "Lucía Fernández",
    role: "Paciente",
    text: "Agendar mi cita tomó menos de un minuto. Los recordatorios automáticos me han salvado de varios olvidos.",
  },
  {
    name: "Jorge Medina",
    role: "Paciente",
    text: "Por fin un sistema de citas médicas que no se siente complicado. La confirmación es inmediata y clara.",
  },
  {
    name: "Andrea Salas",
    role: "Paciente",
    text: "Me da tranquilidad saber que mi historial médico está protegido. Lo recomiendo totalmente.",
  },
];

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#inicio" className="flex items-center gap-2 font-bold text-slate-950">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <HeartPulse size={22} />
          </span>
          <span className="text-base tracking-wider font-extrabold text-blue-900">HOSPITAL DIGITAL</span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="transition hover:text-blue-600">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 hover:shadow-lg"
          >
            Agendar Cita Ahora
          </Link>
        </div>

        <button
          aria-label="Abrir menú"
          className="text-slate-700 md:hidden p-2 rounded-lg hover:bg-slate-50"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú Móvil Corregido */}
      {open && (
        <div className="absolute top-full left-0 w-full border-t border-slate-100 bg-white px-6 py-6 shadow-xl md:hidden flex flex-col gap-4 z-50">
          <nav className="flex flex-col gap-4 text-base font-medium text-slate-700">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="py-2 hover:text-blue-600 border-b border-slate-50" onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="mt-4 rounded-full bg-blue-600 py-3 text-center font-bold text-white shadow-md"
            >
              Agendar Cita Ahora
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-gradient-to-br from-blue-50/70 via-white to-white py-12 md:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-12">
        
        {/* Columna Texto */}
        <div className="md:col-span-7 flex flex-col justify-center text-center md:text-left z-10">
          <span className="inline-flex self-center md:self-start items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-sm">
            <HeartPulse size={14} className="animate-pulse" /> Atención médica simplificada
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl leading-[1.15]">
            Agenda tu cita médica <br className="hidden lg:inline"/>
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">de forma rápida y segura</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-600 leading-relaxed mx-auto md:mx-0">
            El sistema inteligente que simplifica tu atención de salud con recordatorios por IA y acceso inmediato a especialistas.
          </p>
          <div className="mt-10 flex flex-wrap justify-center md:justify-start gap-4">
            <Link
              to="/login"
              className="rounded-full bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]"
            >
              Iniciar sesión
            </Link>
            <a
              href="#servicios"
              className="rounded-full bg-white border border-slate-200 px-8 py-4 text-base font-bold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/30"
            >
              Ver Servicios
            </a>
          </div>
        </div>

        {/* Columna Imagen Integrada */}
        <div className="md:col-span-5 relative w-full flex justify-center items-center">
          <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-blue-400 to-cyan-300 opacity-20 blur-3xl -z-10" />
          <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-white shadow-2xl w-full max-w-md md:max-w-none aspect-[4/5]">
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=900&auto=format&fit=crop"
              alt="Médico profesional usando tablet"
              className="h-full w-full object-cover object-center transform hover:scale-105 transition duration-500"
            />
          </div>
        </div>

      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="servicios" className="bg-white py-20 border-y border-slate-50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="group relative flex flex-col items-center text-center p-6 rounded-2xl transition hover:bg-blue-50/40">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white shadow-inner">
                <Icon size={28} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500 max-w-xs">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="nosotros" className="bg-slate-50/60 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Cómo Funciona</h2>
          <p className="mt-3 text-slate-500">Sigue tres sencillos pasos para asegurar tu atención profesional de manera inmediata.</p>
        </div>

        <div className="grid gap-12 sm:grid-cols-3 relative">
          {STEPS.map(({ icon: Icon, title, description }, i) => (
            <div key={title} className="relative flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100/80 z-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-100 font-bold mb-5">
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{description}</p>

              {i < STEPS.length - 1 && (
                <div className="absolute right-[-2.5rem] top-14 hidden h-0.5 w-16 border-t-2 border-dashed border-blue-200 lg:block -z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="contacto" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">La voz de nuestros pacientes</h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {TESTIMONIALS.map(({ name, role, text }) => (
            <figure
              key={name}
              className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-8 shadow-md shadow-slate-100/50 relative hover:shadow-lg transition duration-300"
            >
              <div>
                <Quote className="text-blue-200 mb-4" size={32} />
                <blockquote className="text-sm leading-relaxed text-slate-600 italic">
                  "{text}"
                </blockquote>
              </div>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-50 pt-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm">
                  {name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{name}</div>
                  <div className="text-xs text-blue-600 font-medium">{role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_50%)]" />
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-6 text-center md:flex-row md:text-left relative z-10">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            ¿Listo para agendar tu próxima cita?
          </h2>
          <p className="mt-3 max-w-xl text-base text-blue-100">
            Regístrate de manera gratuita y accede a la disponibilidad de tus médicos favoritos en tiempo real.
          </p>
        </div>
        <Link
          to="/login"
          className="shrink-0 rounded-full bg-white px-8 py-4 text-base font-bold text-blue-700 shadow-xl transition hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98]"
        >
          Comienza Aquí
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-950 py-12 text-center text-sm text-slate-400 border-t border-slate-900">
      <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 font-bold text-white">
          <HeartPulse size={18} className="text-blue-500" />
          <span className="tracking-wider text-xs">HOSPITAL DIGITAL</span>
        </div>
        <div className="text-xs text-slate-500">
          © {new Date().getFullYear()} Hospital Digital. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

export default function HospitalDigitalLanding() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-blue-500 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}