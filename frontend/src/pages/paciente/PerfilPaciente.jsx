import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, Compass, FileText, CheckCircle, Save, AlertCircle, Edit, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import Sidebar from '../../components/Sidebar';
import './PatientDashboard.css';

const PerfilPaciente = ({ isWidget } = {}) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Cargar datos actuales del usuario autenticado
  const [formData, setFormData] = useState({
    name: user?.name || '',
    lastName: user?.lastName || '',
    dni: user?.dni || '',
    phone: user?.phone || '',
    age: user?.age || '',
    email: user?.email || '',
    address: user?.address || '',
    policy: user?.policy || '',
  });

  // Sincronizar datos si el usuario en el contexto cambia
  useEffect(() => {
    if (!isEditing) {
      setFormData({
        name: user?.name || '',
        lastName: user?.lastName || '',
        dni: user?.dni || '',
        phone: user?.phone || '',
        age: user?.age || '',
        email: user?.email || '',
        address: user?.address || '',
        policy: user?.policy || '',
      });
    }
  }, [user, isEditing]);

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      lastName: user?.lastName || '',
      dni: user?.dni || '',
      phone: user?.phone || '',
      age: user?.age || '',
      email: user?.email || '',
      address: user?.address || '',
      policy: user?.policy || '',
    });
    setIsEditing(false);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setSuccess('');
    setError('');

    // Validaciones mínimas
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setError('El nombre completo, celular y correo electrónico son obligatorios.');
      setLoading(false);
      return;
    }

    // Validar Celular (exactamente 9 dígitos numéricos)
    const phoneLimpio = formData.phone.trim();
    if (!/^\d+$/.test(phoneLimpio) || phoneLimpio.length !== 9) {
      setError('El número de celular debe contener exactamente 9 dígitos numéricos.');
      setLoading(false);
      return;
    }

    // Validar DNI si está provisto (exactamente 8 dígitos numéricos)
    const dniLimpio = formData.dni.trim();
    if (dniLimpio && (!/^\d+$/.test(dniLimpio) || dniLimpio.length !== 8)) {
      setError('El DNI debe contener exactamente 8 dígitos numéricos.');
      setLoading(false);
      return;
    }

    // Validar Edad (obligatoria y mayor de edad)
    const edadNum = Number(formData.age);
    if (!formData.age || Number.isNaN(edadNum) || edadNum < 18) {
      setError('Debes ser mayor de edad (mínimo 18 años) para actualizar tu perfil.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        age: Number(formData.age)
      };

      const res = await userService.updateProfile(payload);
      
      // Actualizar el estado global del usuario en el AuthContext
      if (res.data?.user) {
        updateUser(res.data.user);
      } else {
        updateUser({ ...user, ...payload });
      }

      setSuccess('¡Perfil actualizado con éxito!');
      setIsEditing(false);
      // Desvanecer el mensaje de éxito tras 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Error al guardar los cambios del perfil.');
    } finally {
      setLoading(false);
    }
  };

  const mainContent = (
    <div className="patient-container mx-auto max-w-3xl">
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

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '24px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: '#eff6ff', color: '#2563eb',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <User size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>Mi Perfil</h1>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>Administra y actualiza tu información médica personal.</p>
          </div>
        </div>

        {/* Notificaciones */}
        {success && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0',
            padding: '12px 16px', borderRadius: '10px', fontSize: '13px',
            fontWeight: '600', marginBottom: '20px', animation: 'fadeIn 0.2s ease'
          }}>
            <CheckCircle size={16} />
            {success}
          </div>
        )}

        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca',
            padding: '12px 16px', borderRadius: '10px', fontSize: '13px',
            fontWeight: '600', marginBottom: '20px', animation: 'fadeIn 0.2s ease'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Nombre Completo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Nombre Completo *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              readOnly={!isEditing}
              style={{
                padding: '10px 14px', borderRadius: '10px',
                border: isEditing ? '1px solid #3b82f6' : '1px solid #cbd5e1',
                fontSize: '13px', outline: 'none',
                background: isEditing ? '#ffffff' : '#f8fafc',
                color: isEditing ? '#0f172a' : '#475569',
                cursor: isEditing ? 'text' : 'default',
                transition: 'border-color 0.15s ease, background-color 0.15s ease'
              }}
            />
          </div>

          {/* Apellidos Completos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Apellidos Completos</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              readOnly={!isEditing}
              style={{
                padding: '10px 14px', borderRadius: '10px',
                border: isEditing ? '1px solid #3b82f6' : '1px solid #cbd5e1',
                fontSize: '13px', outline: 'none',
                background: isEditing ? '#ffffff' : '#f8fafc',
                color: isEditing ? '#0f172a' : '#475569',
                cursor: isEditing ? 'text' : 'default',
                transition: 'border-color 0.15s ease, background-color 0.15s ease'
              }}
            />
          </div>

          {/* DNI */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Documento de Identidad (DNI)</label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              maxLength={12}
              readOnly={!isEditing}
              style={{
                padding: '10px 14px', borderRadius: '10px',
                border: isEditing ? '1px solid #3b82f6' : '1px solid #cbd5e1',
                fontSize: '13px', outline: 'none',
                background: isEditing ? '#ffffff' : '#f8fafc',
                color: isEditing ? '#0f172a' : '#475569',
                cursor: isEditing ? 'text' : 'default',
                transition: 'border-color 0.15s ease, background-color 0.15s ease'
              }}
            />
          </div>

          {/* Celular / Teléfono */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Celular *</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              readOnly={!isEditing}
              style={{
                padding: '10px 14px', borderRadius: '10px',
                border: isEditing ? '1px solid #3b82f6' : '1px solid #cbd5e1',
                fontSize: '13px', outline: 'none',
                background: isEditing ? '#ffffff' : '#f8fafc',
                color: isEditing ? '#0f172a' : '#475569',
                cursor: isEditing ? 'text' : 'default',
                transition: 'border-color 0.15s ease, background-color 0.15s ease'
              }}
            />
          </div>

          {/* Edad */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Edad *</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: isEditing ? '1px solid #3b82f6' : '1px solid #cbd5e1',
              borderRadius: '10px',
              background: isEditing ? '#ffffff' : '#f8fafc',
              paddingRight: '14px',
              width: '140px',
              transition: 'border-color 0.15s ease, background-color 0.15s ease'
            }}>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min={0}
                max={120}
                required
                readOnly={!isEditing}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '13px',
                  color: isEditing ? '#0f172a' : '#475569',
                  cursor: isEditing ? 'text' : 'default'
                }}
              />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', userSelect: 'none' }}>años</span>
            </div>
          </div>

          {/* Correo Electrónico */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Correo Electrónico *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              readOnly={!isEditing}
              style={{
                padding: '10px 14px', borderRadius: '10px',
                border: isEditing ? '1px solid #3b82f6' : '1px solid #cbd5e1',
                fontSize: '13px', outline: 'none',
                background: isEditing ? '#ffffff' : '#f8fafc',
                color: isEditing ? '#0f172a' : '#475569',
                cursor: isEditing ? 'text' : 'default',
                transition: 'border-color 0.15s ease, background-color 0.15s ease'
              }}
            />
          </div>

          {/* Dirección */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Dirección Física</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              readOnly={!isEditing}
              style={{
                padding: '10px 14px', borderRadius: '10px',
                border: isEditing ? '1px solid #3b82f6' : '1px solid #cbd5e1',
                fontSize: '13px', outline: 'none',
                background: isEditing ? '#ffffff' : '#f8fafc',
                color: isEditing ? '#0f172a' : '#475569',
                cursor: isEditing ? 'text' : 'default',
                transition: 'border-color 0.15s ease, background-color 0.15s ease'
              }}
            />
          </div>

          {/* Póliza */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>N° de Póliza / Seguro Médico</label>
            <input
              type="text"
              name="policy"
              value={formData.policy}
              onChange={handleChange}
              placeholder="Ej. Seguro RIMAC, ESSALUD, SIS, etc."
              readOnly={!isEditing}
              style={{
                padding: '10px 14px', borderRadius: '10px',
                border: isEditing ? '1px solid #3b82f6' : '1px solid #cbd5e1',
                fontSize: '13px', outline: 'none',
                background: isEditing ? '#ffffff' : '#f8fafc',
                color: isEditing ? '#0f172a' : '#475569',
                cursor: isEditing ? 'text' : 'default',
                transition: 'border-color 0.15s ease, background-color 0.15s ease'
              }}
            />
          </div>

          {/* Botones de acción */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1',
                    borderRadius: '10px', padding: '12px 24px', fontSize: '14px',
                    fontWeight: '700', cursor: 'pointer', transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#e2e8f0')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#f1f5f9')}
                >
                  <X size={16} />
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: '#2563eb', color: '#fff', border: 'none',
                    borderRadius: '10px', padding: '12px 24px', fontSize: '14px',
                    fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1, transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.background = '#1d4ed8')}
                  onMouseLeave={e => !loading && (e.currentTarget.style.background = '#2563eb')}
                >
                  <Save size={16} />
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: '#2563eb', color: '#fff', border: 'none',
                  borderRadius: '10px', padding: '12px 24px', fontSize: '14px',
                  fontWeight: '700', cursor: 'pointer', transition: 'background 0.15s ease'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1d4ed8')}
                onMouseLeave={e => (e.currentTarget.style.background = '#2563eb')}
              >
                <Edit size={16} />
                Editar Perfil
              </button>
            )}
          </div>
        </form>
      </div>
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

export default PerfilPaciente;
