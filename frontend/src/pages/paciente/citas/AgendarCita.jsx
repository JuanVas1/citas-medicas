import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, CalendarClock, CheckCircle2, Clock } from 'lucide-react';
import { horarioService } from '../../../services/horarioService';
import { citaService } from '../../../services/citaService';

// Nombre de día según el índice JS (0=Domingo)
const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const AgendarCita = () => {
  const [step, setStep] = useState(1); // 1: elegir doctor | 2: elegir horario y fecha | 3: confirmar

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const [doctorSeleccionado, setDoctorSeleccionado] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

  const [fecha, setFecha] = useState('');
  const [reason, setReason] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Cargar doctores al montar
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/doctors', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        // Solo mostrar doctores con estructura nueva (tienen userId)
        setDoctors(data.filter(d => d.userId));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  // Cuando se selecciona un doctor, cargar sus horarios
  const seleccionarDoctor = async (doctor) => {
    setDoctorSeleccionado(doctor);
    setHorarioSeleccionado(null);
    setFecha('');
    try {
      const res = await fetch(`http://localhost:5000/api/horarios/doctor/${doctor._id}`);
      const data = await res.json();
      setHorarios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setHorarios([]);
    }
    setStep(2);
  };

  // Calcular fechas disponibles para el horario seleccionado (próximas 4 semanas)
  const getFechasDisponibles = (horario) => {
    if (!horario) return [];

    // Buscar el índice del día en español
    const dayMap = {
      domingo: 0, lunes: 1, martes: 2, miércoles: 3, miercoles: 3,
      jueves: 4, viernes: 5, sábado: 6, sabado: 6
    };
    const targetDay = dayMap[horario.day.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')] ?? -1;
    if (targetDay === -1) return [];

    const fechas = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= 28; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (d.getDay() === targetDay) {
        fechas.push(d.toISOString().split('T')[0]); // YYYY-MM-DD
      }
    }
    return fechas;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorSeleccionado || !horarioSeleccionado || !fecha || !reason.trim()) {
      alert('Completa todos los campos');
      return;
    }
    setEnviando(true);
    try {
      await citaService.create({
        doctorId: doctorSeleccionado._id,
        date: fecha,
        startTime: horarioSeleccionado.startTime,
        endTime: horarioSeleccionado.endTime,
        reason: reason.trim()
      });
      setStep(3);
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Error al agendar');
    } finally {
      setEnviando(false);
    }
  };

  const resetear = () => {
    setStep(1);
    setDoctorSeleccionado(null);
    setHorarioSeleccionado(null);
    setFecha('');
    setReason('');
  };

  const fechasDisponibles = getFechasDisponibles(horarioSeleccionado);

  return (
    <main className="min-h-screen bg-[#f5f8fd] px-4 py-10">
      <div className="mx-auto max-w-3xl">

        {/* Volver */}
        <Link
          to="/paciente"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 transition"
        >
          <ArrowLeft size={16} />
          Volver al dashboard
        </Link>

        {/* Indicador de pasos */}
        <div className="mb-8 flex items-center gap-3">
          {[
            { n: 1, label: 'Elegir doctor' },
            { n: 2, label: 'Horario y fecha' },
            { n: 3, label: 'Confirmado' }
          ].map(({ n, label }, i, arr) => (
            <React.Fragment key={n}>
              <div className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition
                  ${step >= n ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step > n ? '✓' : n}
                </div>
                <span className={`text-sm font-medium hidden sm:inline ${step >= n ? 'text-blue-700' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div className={`flex-1 h-0.5 ${step > n ? 'bg-blue-400' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ─── PASO 1: Elegir doctor ─── */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Agendar Cita Médica</h1>
            <p className="text-sm text-gray-500 mb-6">Selecciona el médico con quien deseas consultar.</p>

            {loadingDoctors ? (
              <p className="text-gray-400 text-center py-8">Cargando doctores...</p>
            ) : doctors.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No hay doctores disponibles.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {doctors.map((doctor) => (
                  <button
                    key={doctor._id}
                    onClick={() => seleccionarDoctor(doctor)}
                    className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 text-left transition hover:border-blue-400 hover:bg-blue-50/40 hover:shadow-sm"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-lg">
                      {(doctor.userId?.name || doctor.name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Dr. {doctor.userId?.name || doctor.name}
                      </p>
                      <p className="text-sm text-blue-600">{doctor.specialty || doctor.speciality}</p>
                      {doctor.office && (
                        <p className="text-xs text-gray-400">Consultorio: {doctor.office}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── PASO 2: Elegir horario y fecha ─── */}
        {step === 2 && doctorSeleccionado && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

            {/* Resumen del doctor seleccionado */}
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-lg">
                {(doctorSeleccionado.userId?.name || doctorSeleccionado.name || '?').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Dr. {doctorSeleccionado.userId?.name || doctorSeleccionado.name}
                </p>
                <p className="text-sm text-blue-600">{doctorSeleccionado.specialty || doctorSeleccionado.speciality}</p>
              </div>
              <button
                onClick={() => { setStep(1); setDoctorSeleccionado(null); setHorarios([]); }}
                className="ml-auto text-xs text-gray-400 hover:text-blue-600 transition underline"
              >
                Cambiar doctor
              </button>
            </div>

            <h2 className="text-lg font-bold text-gray-900 mb-4">Horarios disponibles</h2>

            {horarios.length === 0 ? (
              <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
                Este doctor aún no tiene horarios configurados. Comunícate con la clínica.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 mb-6">
                {horarios.map((h) => (
                  <button
                    key={h._id}
                    onClick={() => { setHorarioSeleccionado(h); setFecha(''); }}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition
                      ${horarioSeleccionado?._id === h._id
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
                      }`}
                  >
                    <Clock size={20} className="text-blue-500 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">{h.day}</p>
                      <p className="text-sm text-gray-500">{h.startTime} – {h.endTime}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Fechas disponibles según el horario seleccionado */}
            {horarioSeleccionado && (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  Fechas disponibles — {horarioSeleccionado.day}
                </h2>
                <div className="grid gap-2 grid-cols-2 sm:grid-cols-4 mb-6">
                  {fechasDisponibles.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFecha(f)}
                      className={`rounded-xl border py-3 text-sm font-medium text-center transition
                        ${fecha === f
                          ? 'border-blue-500 bg-blue-600 text-white'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                    >
                      {new Date(f + 'T12:00:00').toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Motivo */}
            {fecha && horarioSeleccionado && (
              <form onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo de la consulta
                </label>
                <textarea
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  placeholder="Describa brevemente el motivo de la consulta..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 mb-5"
                />

                {/* Resumen */}
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 mb-5 text-sm text-blue-800 space-y-1">
                  <p><strong>Doctor:</strong> Dr. {doctorSeleccionado.userId?.name || doctorSeleccionado.name}</p>
                  <p><strong>Día:</strong> {horarioSeleccionado.day} — {new Date(fecha + 'T12:00:00').toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p><strong>Hora:</strong> {horarioSeleccionado.startTime} – {horarioSeleccionado.endTime}</p>
                </div>

                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {enviando ? 'Agendando...' : 'Confirmar cita'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ─── PASO 3: Éxito ─── */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 size={40} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Cita agendada!</h1>
            <p className="text-gray-500 mb-2">Tu cita fue registrada con estado <strong>pendiente</strong>.</p>
            <p className="text-sm text-gray-400 mb-8">El médico la confirmará próximamente. Recibirás un recordatorio 24 horas antes.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/paciente/citas"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition"
              >
                Ver mis citas
              </Link>
              <button
                onClick={resetear}
                className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Agendar otra cita
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
};

export default AgendarCita;