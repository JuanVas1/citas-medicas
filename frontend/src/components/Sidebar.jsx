import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Calendar, Users, UserCheck, Clock, Tag, FileText, BarChart2, Settings, User } from 'lucide-react';
import './Sidebar.css';

const AdminItems = [
    { section: 'PRINCIPAL', items: [
    { to: '/admin', label: 'Dashboard', icon: Home },
    { to: '/admin/citas', label: 'Citas', icon: Calendar },
    { to: '/admin/pacientes', label: 'Pacientes', icon: Users },
  ]},
  { section: 'MÉDICO', items: [
    { to: '/admin/doctores', label: 'Doctores', icon: UserCheck },
    { to: '/admin/horarios', label: 'Horarios', icon: Clock },
    { to: '/admin/especialidades', label: 'Especialidades', icon: Tag },
  ]},
  { section: 'GESTIÓN', items: [
    { to: '/admin/estadisticas', label: 'Estadísticas', icon: BarChart2 },
  ]},
  { section: 'SISTEMA', items: [
    { to: '/admin/usuarios', label: 'Usuarios', icon: User },
    { to: '/admin/configuracion', label: 'Configuración', icon: Settings },
  ]}
];

const PatientItems = [
  { section: 'MI SALUD', items: [
    { to: '/paciente', label: 'Inicio', icon: Home },
    { to: '/paciente/citas/agendar', label: 'Agendar cita', icon: Calendar },
    { to: '/paciente/citas', label: 'Mis citas', icon: Calendar },
    { to: '/paciente/citas/historial', label: 'Historial', icon: FileText },
  ]},
  { section: 'MÉDICOS', items: [
    { to: '/paciente/doctores', label: 'Doctores', icon: UserCheck },
    { to: '/paciente/especialidades', label: 'Especialidades', icon: Tag },
  ]},
  { section: 'CUENTA', items: [
    { to: '/paciente/perfil', label: 'Mi perfil', icon: User },
    { to: '/paciente/configuracion', label: 'Configuración', icon: Settings },
  ]}
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const rawRole = (user?.role || '').toString();
  const normalizedRole = rawRole.trim().toLowerCase() === 'admin' ? 'administrador' : rawRole.trim().toLowerCase();
  const isAdmin = normalizedRole === 'administrador';
  const menu = isAdmin ? AdminItems : PatientItems;

  return (
    <aside className="site-sidebar">
      <div className="sidebar-top">
        <div className="brand">
          <div className="brand-icon">MA</div>
          <div className="brand-text">
            <div className="brand-title">MedAdmin</div>
            <div className="brand-sub">Sistema {isAdmin ? 'hospitalario' : 'paciente'}</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-sections">
        {menu.map((group) => (
          <div key={group.section} className="sidebar-group">
            <div className="group-title">{group.section}</div>
            <div className="group-items">
              {group.items.map((it) => {
                const Icon = it.icon;
                // determine active state by comparing pathname and optional ?tab param
                const [targetPath, targetSearch] = it.to.split('?');
                let isActive = false;
                try {
                  const currentPath = location.pathname;
                  const currentParams = new URLSearchParams(location.search);
                  const currentTab = currentParams.get('tab');

                  if (targetSearch) {
                    const targetParams = new URLSearchParams(targetSearch);
                    if (targetParams.get('tab')) {
                      isActive = currentPath === targetPath && currentTab === targetParams.get('tab');
                    } else {
                      isActive = currentPath === targetPath;
                    }
                  } else {
                    // Items without query: only active when path matches and there is no tab param
                    isActive = currentPath === targetPath && !currentTab;
                  }
                } catch (e) {
                  isActive = false;
                }

                return (
                  <NavLink key={it.to} to={it.to} className={() => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <span className="item-icon"><Icon size={16} /></span>
                    <span className="item-label">{it.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-block">
          <div className="user-avatar">{user?.name ? user.name.split(' ').map(n => n[0]).slice(0,2).join('') : 'US'}</div>
          <div className="user-meta">
            <div className="user-name">{user?.name || 'Usuario'}</div>
            <div className="user-role-small">{user?.role || ''}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={logout}>Cerrar sesión</button>
      </div>
    </aside>
  );
}
