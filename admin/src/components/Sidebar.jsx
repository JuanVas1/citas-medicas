import React from 'react';

export default function Sidebar({ user, activeTab, setActiveTab, onLogout }) {
  const navItems = [
    { id: 'resumen', label: 'Resumen General', icon: '📊' },
    { id: 'citas', label: 'Gestión de Citas', icon: '📅' },
    { id: 'doctores', label: 'Equipo Médico', icon: '👨‍⚕️' }
  ];

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <span className="eyebrow">Administración</span>
        <h2>Panel Médico</h2>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            type="button"
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.name ? user.name.charAt(0).toUpperCase() : 'A'}</div>
          <div className="user-details">
            <span className="user-name">{user?.name || 'Administrador'}</span>
            <span className="user-role">Admin</span>
          </div>
        </div>
        <button onClick={onLogout} className="btn-logout-sidebar" type="button">
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
