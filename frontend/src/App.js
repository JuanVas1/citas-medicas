import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import ClientDashboard from './components/ClientDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setCurrentPage(JSON.parse(storedUser).role === 'admin' ? 'admin' : 'client');
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentPage(userData.role === 'admin' ? 'admin' : 'client');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('login');
  };

  return (
    <div className="App">
      {!user ? (
        <>
          {currentPage === 'login' && (
            <Login 
              onLoginSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setCurrentPage('register')}
            />
          )}
          {currentPage === 'register' && (
            <Register 
              onRegisterSuccess={handleLoginSuccess}
              onSwitchToLogin={() => setCurrentPage('login')}
            />
          )}
        </>
      ) : (
        <>
          {user.role === 'cliente' && (
            <ClientDashboard user={user} onLogout={handleLogout} />
          )}
          {user.role === 'admin' && (
            <AdminDashboard user={user} onLogout={handleLogout} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
