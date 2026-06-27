import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow p-8 max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-4">Portal del Doctor</h1>
        <p className="text-gray-600 mb-6">Gestiona tu agenda médica desde una aplicación independiente.</p>
        <Link to="/login" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg">
          Iniciar sesión
        </Link>
      </div>
    </main>
  );
};

export default Landing;
