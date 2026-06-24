import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const onChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await register({ ...form, role: 'paciente' });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'No fue posible registrarte');
    }
  };

  return (
    <main className="container">
      <h2>Registro de paciente</h2>
      <form onSubmit={onSubmit} className="form">
        <input name="name" placeholder="Nombre completo" value={form.name} onChange={onChange} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} />
        <input name="phone" placeholder="Telefono" value={form.phone} onChange={onChange} />
        <input name="password" type="password" placeholder="Contrasena" value={form.password} onChange={onChange} />
        <button type="submit">Crear cuenta</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>
        Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
      </p>
    </main>
  );
};

export default Register;