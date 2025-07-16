import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Busca os dados do usuário ao carregar a página
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/users/${id}`);
      setUser(response.data.user);
    } catch (error) {
      toast.error('Falha ao carregar dados do usuário.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Salvando alterações...');
    try {
      await api.put(`/admin/users/${id}`, user);
      toast.dismiss(loadingToast);
      toast.success('Usuário atualizado com sucesso!');
      navigate('/directory');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Falha ao atualizar usuário.');
      console.error(error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <div className="text-center">Usuário não encontrado.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Editar Usuário: {user.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
          <input type="text" name="name" id="name" value={user.name || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" id="email" value={user.email || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
          <input type="text" name="phone" id="phone" value={user.phone || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Endereço</label>
          <input type="text" name="address" id="address" value={user.address || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
          <select name="category" id="category" value={user.category || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            <option value="customer">Cliente</option>
            <option value="supplier">Fornecedor</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/directory')} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserPage;