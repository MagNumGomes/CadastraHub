import React from 'react';
import { useAuth } from '../hooks/useAuth';
import UserList from '../components/UserList';

const AdminDashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        Acesso negado: você não é um administrador.
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Painel do Administrador</h1>
      <p className="mb-8">Bem-vindo, <strong>{user.name}</strong>!</p>
      
      <UserList />
    </div>
  );
};

export default AdminDashboard;
