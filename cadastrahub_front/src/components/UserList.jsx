import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserEditModal from './UserEditModal'; // seu modal já criado

const PAGE_SIZE = 5;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'view' ou 'edit'
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = async (page) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3001/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: PAGE_SIZE },
      });
      setUsers(response.data.users);
      setTotalUsers(response.data.total || response.data.users.length);
    } catch (err) {
      setError('Falha ao carregar usuários.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleDelete = async (userId) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    setDeletingId(userId);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Recarregar lista
      fetchUsers(page);
    } catch (err) {
      alert('Erro ao excluir usuário.');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setModalMode('view');
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setModalMode(null);
  };

  const handleSaveUser = async (updatedUser) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:3001/api/users/${updatedUser.id}`,
        updatedUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(page);
    } catch (err) {
      alert('Erro ao salvar usuário.');
      throw err; // para o modal mostrar erro se quiser
    }
  };

  const totalPages = Math.ceil(totalUsers / PAGE_SIZE);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Usuários Cadastrados</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && <p>Carregando usuários...</p>}

      <table className="min-w-full border border-gray-300 mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Nome</th>
            <th className="border px-4 py-2 text-left">Email</th>
            <th className="border px-4 py-2 text-left">Role</th>
            <th className="border px-4 py-2 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {!loading && users.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4">Nenhum usuário encontrado.</td>
            </tr>
          )}
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => handleView(user)}
            >
              <td className="border px-4 py-2">{user.id}</td>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.role || 'Usuário'}</td>
              <td className="border px-4 py-2 text-center space-x-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(user);
                  }}
                >
                  Editar
                </button>
                <button
                  className={`px-3 py-1 rounded text-white ${
                    deletingId === user.id ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
                  }`}
                  disabled={deletingId === user.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(user.id);
                  }}
                >
                  {deletingId === user.id ? 'Excluindo...' : 'Excluir'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className={`px-4 py-2 rounded ${
              page <= 1
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Anterior
          </button>

          <span>Página {page} de {totalPages}</span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-4 py-2 rounded ${
              page >= totalPages
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Próximo
          </button>
        </div>
      )}

      {/* Modal de edição */}
      {modalMode === 'edit' && selectedUser && (
        <UserEditModal
          user={selectedUser}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
        />
      )}

      {/* Modal de detalhes */}
      {modalMode === 'view' && selectedUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-6 rounded shadow-md max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Detalhes do Usuário</h3>
            <p><strong>ID:</strong> {selectedUser.id}</p>
            <p><strong>Nome:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Role:</strong> {selectedUser.role || 'Usuário'}</p>
            <p><strong>CPF/CNPJ:</strong> {selectedUser.cpfCnpj || 'Não informado'}</p>
            <p><strong>Telefone:</strong> {selectedUser.phone || 'Não informado'}</p>
            <p><strong>Endereço:</strong> {selectedUser.address || 'Não informado'}</p>

            <button
              className="mt-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              onClick={handleCloseModal}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
