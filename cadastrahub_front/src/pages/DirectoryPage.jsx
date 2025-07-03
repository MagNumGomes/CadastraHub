import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DirectoryPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await api.get('/admin/users');
                setUsers(response.data);
                setFilteredUsers(response.data);
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        let results = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filterCategory !== 'all') {
            results = results.filter(user => user.category === filterCategory);
        }

        setFilteredUsers(results);
    }, [searchTerm, filterCategory, users]);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Diretório</h1>
            
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-100 rounded-lg">
                <input
                    type="text"
                    placeholder="Pesquisar por nome ou email..."
                    className="flex-grow p-2 border rounded-md"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                    className="p-2 border rounded-md"
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="all">Todas as Categorias</option>
                    <option value="customer">Apenas Clientes</option>
                    <option value="supplier">Apenas Fornecedores</option>
                </select>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-4 text-left font-semibold">Nome</th>
                            <th className="p-4 text-left font-semibold">Email</th>
                            <th className="p-4 text-left font-semibold">Categoria</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? filteredUsers.map(user => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4 capitalize">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.category === 'customer' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                        {user.category === 'customer' ? 'Cliente' : 'Fornecedor'}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="3" className="text-center p-8 text-gray-500">Nenhum resultado encontrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DirectoryPage;