import React from 'react';
import { useAuth } from '../hooks/useAuth';

const AdminDashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  console.log('AdminDashboard user:', user);

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        Acesso negado: você não é um administrador.
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Painel do Administrador</h1>
      <p>Bem-vindo, {user.name}! Esta é a página inicial do admin.</p>
    </div>
  );
};

export default AdminDashboard;
