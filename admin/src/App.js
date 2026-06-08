import React, { useState, useEffect } from 'react';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import './styles/App.css';

function AdminApp() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.role === 'admin') {
        setUser(userData);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    if (userData.role === 'admin') {
      setUser(userData);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="App admin-app">
      {!user ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <AdminDashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default AdminApp;
