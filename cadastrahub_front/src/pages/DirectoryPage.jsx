import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import UserCard from '../components/common/UserCard';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { FiSearch, FiDownload } from 'react-icons/fi';

// Hook customizado para "debounce"
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const DirectoryPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/users/search', {
                params: { q: debouncedSearchTerm, category: filterCategory }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            toast.error("Não foi possível carregar os usuários.");
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchTerm, filterCategory]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDeleteClick = (user) => {
      setUserToDelete(user);
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
      setUserToDelete(null);
    };

    const handleConfirmDelete = async () => {
      if (!userToDelete) return;
      try {
        await api.delete(`/admin/users/${userToDelete.id}`);
        toast.success(`Usuário "${userToDelete.name}" excluído com sucesso!`);
        setUsers(currentUsers => currentUsers.filter(u => u.id !== userToDelete.id));
      } catch (error) {
        toast.error("Falha ao excluir usuário.");
        console.error("Erro ao excluir usuário:", error);
      } finally {
        handleCloseModal();
      }
    };

    const handleExportExcel = async () => {
      setExporting(true);
      const toastId = toast.loading('Gerando sua planilha...');
      try {
        const response = await api.get('/admin/users/export/excel', {
          responseType: 'blob',
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        const date = new Date().toISOString().slice(0, 10);
        link.setAttribute('download', `usuarios_cadastrahub_${date}.xlsx`);
        
        document.body.appendChild(link);
        link.click();
        
        toast.dismiss(toastId);
        toast.success('Download iniciado!');
        link.parentNode.removeChild(link);

      } catch (error) {
        toast.dismiss(toastId);
        toast.error('Falha ao gerar o arquivo.');
        console.error('Erro ao exportar:', error);
      } finally {
        setExporting(false);
      }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h1 className="text-3xl font-bold text-gray-800">Diretório de Usuários</h1>
              <button
                onClick={handleExportExcel}
                disabled={exporting}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                <FiDownload />
                {exporting ? 'Exportando...' : 'Exportar para Excel'}
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-gray-50 border rounded-lg">
                <div className="relative flex-grow">
                    <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Pesquisar por nome ou email..." className="w-full p-2 pl-10 border rounded-md focus:ring-2 focus:ring-indigo-400" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select className="p-2 border rounded-md focus:ring-2 focus:ring-indigo-400" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                    <option value="all">Todas as Categorias</option>
                    <option value="customer">Apenas Clientes</option>
                    <option value="supplier">Apenas Fornecedores</option>
                </select>
            </div>

            {loading ? <LoadingSpinner /> : (
                <>
                    {users.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {users.map(user => (
                                <UserCard key={user.id} user={user} onDeleteClick={handleDeleteClick} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 px-4 bg-white rounded-lg shadow"><h3 className="text-xl font-semibold text-gray-700">Nenhum resultado encontrado</h3><p className="text-gray-500 mt-2">Tente ajustar os termos da sua busca ou filtros.</p></div>
                    )}
                </>
            )}

            <ConfirmationModal 
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onConfirm={handleConfirmDelete}
              title="Confirmar Exclusão"
              message={`Você tem certeza que deseja excluir o usuário "${userToDelete?.name}"? Esta ação não pode ser desfeita.`}
            />
        </div>
    );
};

export default DirectoryPage;