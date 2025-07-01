import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ clients: 0, suppliers: 0 });
    const [inactiveUsers, setInactiveUsers] = useState({ '6m': [], '1y': [], '2y': [], '5y': [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Assumindo que o endpoint /users retorna todos os usuários para o admin
                const response = await api.get('/users');
                const allUsers = response.data;
                setUsers(allUsers);

                // Calcular estatísticas
                const clients = allUsers.filter(u => u.category === 'customer').length;
                const suppliers = allUsers.filter(u => u.category === 'supplier').length;
                setStats({ clients, suppliers });

                // Calcular inatividade
                // IMPORTANTE: Usamos 'updatedAt' como um proxy para "último acesso",
                // já que não podemos alterar o backend para ter 'lastLogin'.
                const now = new Date();
                const periods = {
                    '6m': 6, '1y': 12, '2y': 24, '5y': 60
                };
                const inactive = { '6m': [], '1y': [], '2y': [], '5y': [] };

                allUsers.forEach(user => {
                    const lastUpdate = new Date(user.updatedAt);
                    const diffMonths = (now.getFullYear() - lastUpdate.getFullYear()) * 12 + (now.getMonth() - lastUpdate.getMonth());
                    
                    if (diffMonths >= periods['5y']) inactive['5y'].push(user);
                    else if (diffMonths >= periods['2y']) inactive['2y'].push(user);
                    else if (diffMonths >= periods['1y']) inactive['1y'].push(user);
                    else if (diffMonths >= periods['6m']) inactive['6m'].push(user);
                });
                setInactiveUsers(inactive);

            } catch (error) {
                console.error("Erro ao buscar dados do admin:", error);
                toast.error("Falha ao carregar dados do dashboard.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <LoadingSpinner />;

    const renderUserTable = (userList, title) => (
        <div>
            <h3 className="text-lg font-semibold mb-2">{title} ({userList.length})</h3>
            {userList.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-2 px-4 border-b">Nome</th>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">Última Atualização</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList.map(user => (
                                <tr key={user.id}>
                                    <td className="py-2 px-4 border-b">{user.name}</td>
                                    <td className="py-2 px-4 border-b">{user.email}</td>
                                    <td className="py-2 px-4 border-b">{new Date(user.updatedAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : <p className="text-gray-500">Nenhum usuário neste período.</p>}
        </div>
    );


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard do Administrador</h1>
            
            {/* Estatísticas Gerais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <h2 className="text-xl font-semibold text-gray-700">Total de Clientes</h2>
                    <p className="text-4xl font-bold text-blue-600 mt-2">{stats.clients}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <h2 className="text-xl font-semibold text-gray-700">Total de Fornecedores</h2>
                    <p className="text-4xl font-bold text-green-600 mt-2">{stats.suppliers}</p>
                </div>
            </div>

            {/* Relatórios de Inatividade */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Relatório de Inatividade</h2>
                <p className="text-sm text-gray-500 mb-4">Baseado na data da última atualização do perfil do usuário.</p>
                <div className="space-y-6">
                    {renderUserTable(inactiveUsers['6m'], 'Inativos há mais de 6 meses')}
                    {renderUserTable(inactiveUsers['1y'], 'Inativos há mais de 1 ano')}
                    {renderUserTable(inactiveUsers['2y'], 'Inativos há mais de 2 anos')}
                    {renderUserTable(inactiveUsers['5y'], 'Inativos há mais de 5 anos')}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;