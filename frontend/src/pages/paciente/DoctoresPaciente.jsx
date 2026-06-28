import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Stethoscope, Mail, Compass, ShieldCheck } from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import Sidebar from '../../components/Sidebar';
import './PatientDashboard.css';

const toArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const DoctoresPaciente = ({ isWidget } = {}) => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await doctorService.getAll();
        setDoctors(toArray(res));
      } catch (err) {
        console.error('Error al obtener lista de doctores:', err);
        setError('No se pudo cargar el directorio de médicos.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Filtrar doctores por nombre o especialidad
  const filteredDoctors = useMemo(() => {
    const query = search.toLowerCase().trim();
    return doctors.filter((doc) => {
      const nombre = (doc.userId?.name || doc.name || '').toLowerCase();
      const especialidad = (doc.specialty || doc.speciality || '').toLowerCase();
      return nombre.includes(query) || especialidad.includes(query);
    });
  }, [doctors, search]);

  const mainContent = (
    <div className="patient-container mx-auto max-w-5xl">
      {/* Volver */}
      {!isWidget && (
        <Link
          to="/paciente"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-[#1565D8] transition"
        >
          <ArrowLeft size={16} />
          Volver
        </Link>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="eyebrow" style={{ textTransform: 'uppercase', color: '#2563eb', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>Directorio</span>
          <h1 className="welcome-title" style={{ fontSize: '24px', fontWeight: '800' }}>
            Nuestros Doctores
          </h1>
          <p className="text-sm text-gray-500">
            Conoce a nuestro equipo de especialistas médicos disponibles.
          </p>
        </div>

        {/* Buscador */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Buscar por médico o especialidad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 40px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              fontSize: '13px',
              outline: 'none',
              background: '#ffffff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
          />
        </div>
      </div>

      {error && (
        <p style={{ marginTop: '20px', color: '#dc2626', background: '#fef2f2', padding: '10px 16px', borderRadius: '8px', fontSize: '13px' }}>
          ⚠️ {error}
        </p>
      )}

      {loading ? (
        <div className="empty-state" style={{ marginTop: '30px' }}>Cargando directorio médico...</div>
      ) : filteredDoctors.length === 0 ? (
        <div className="empty-state" style={{ marginTop: '30px', textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
          <p style={{ color: '#64748b', fontWeight: '600' }}>No se encontraron doctores que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '24px' }}>
          {filteredDoctors.map((doc) => {
            const nombre = doc.userId?.name || doc.name || 'Doctor';
            const especialidad = doc.specialty || doc.speciality || 'Médico General';
            const consultorio = doc.office || 'No asignado';
            const CMP = doc.licenseNumber || 'No registrada';
            const email = doc.userId?.email || 'Sin correo electrónico';
            const initials = nombre.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

            return (
              <article key={doc._id} style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(0, 0, 0, 0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #2563eb, #0891b2)' }} />

                {/* Cabecera Tarjeta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '50%',
                    background: '#eff6ff', color: '#2563eb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '700', fontSize: '15px'
                  }}>
                    {initials}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {nombre}
                    </h4>
                    <span style={{
                      display: 'inline-block', marginTop: '3px',
                      background: '#e0f2fe', color: '#0369a1',
                      fontSize: '10px', fontWeight: '700',
                      padding: '2px 8px', borderRadius: '12px',
                      textTransform: 'uppercase'
                    }}>
                      {especialidad}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '13px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                    <Compass size={15} style={{ color: '#2563eb', flexShrink: 0 }} />
                    <span>Consultorio: <strong style={{ color: '#0f172a' }}>{consultorio}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                    <ShieldCheck size={15} style={{ color: '#2563eb', flexShrink: 0 }} />
                    <span>Matrícula CMP: <strong style={{ color: '#0f172a' }}>{CMP}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', minWidth: 0 }}>
                    <Mail size={15} style={{ color: '#2563eb', flexShrink: 0 }} />
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', flex: 1 }}>{email}</span>
                  </div>
                </div>

                {/* Acción */}
                <button
                  onClick={() => navigate('/paciente/citas/agendar')}
                  style={{
                    width: '100%',
                    padding: '10px 0',
                    borderRadius: '12px',
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
                  onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}
                >
                  <Stethoscope size={15} />
                  Agendar Cita
                </button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );

  if (isWidget) {
    return mainContent;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="patient-dashboard min-h-screen px-4 py-10">
        {mainContent}
      </main>
    </div>
  );
};

export default DoctoresPaciente;
