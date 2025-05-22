import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import ProductCard from '../components/ProductCard';

const Profile = () => {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [userProducts, setUserProducts] = useState([]);
    const [showAddProductForm, setShowAddProductForm] = useState(false);
    const [productData, setProductData] = useState({
        type: '',
        quantity_tonelada: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchUserProducts();
        }
    }, [user]);

    const fetchUserProducts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3001/api/users/${user.id}/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserProducts(response.data);
        } catch (err) {
            toast.error('Erro ao carregar produtos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        
        if (!productData.type || !productData.quantity_tonelada) {
            toast.error('Preencha todos os campos');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:3001/api/users/${user.id}/products`, 
                productData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            toast.success('Produto adicionado com sucesso!');
            setShowAddProductForm(false);
            setProductData({ type: '', quantity_tonelada: '' });
            fetchUserProducts();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erro ao adicionar produto');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.delete(
                `http://localhost:3001/api/users/${user.id}/products/${productId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            toast.success('Produto removido com sucesso!');
            fetchUserProducts();
        } catch (err) {
            toast.error('Erro ao remover produto');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="text-center py-8">Carregando...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Header do Perfil */}
                    <div className="bg-blue-600 px-6 py-4">
                        <h1 className="text-2xl font-bold text-white">Meu Perfil</h1>
                    </div>
                    
                    {/* Informações do Usuário */}
                    <div className="px-6 py-4 border-b">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                                <p className="text-gray-600">{user.email}</p>
                                {user.phone && <p className="text-gray-600">{user.phone}</p>}
                            </div>
                        </div>
                        
                        <div className="mt-4 flex space-x-3">
                            <button
                                onClick={() => setShowAddProductForm(!showAddProductForm)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                {showAddProductForm ? 'Cancelar' : 'Adicionar Produto'}
                            </button>
                            <button
                                onClick={logout}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Sair
                            </button>
                        </div>
                    </div>

                    {/* Formulário de Adicionar Produto */}
                    {showAddProductForm && (
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Adicionar Novo Produto</h3>
                            <form onSubmit={handleAddProduct}>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                    <div className="sm:col-span-3">
                                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                            Tipo de Material
                                        </label>
                                        <select
                                            id="type"
                                            name="type"
                                            value={productData.type}
                                            onChange={(e) => setProductData({...productData, type: e.target.value})}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                            required
                                        >
                                            <option value="">Selecione um material</option>
                                            <option value="COBRE">COBRE</option>
                                            <option value="ALUMINIO">ALUMINIO</option>
                                            <option value="CHUMBO">CHUMBO</option>
                                            <option value="MAGNESIO">MAGNESIO</option>
                                            <option value="NICKEL">NICKEL</option>
                                            <option value="INOX">INOX</option>
                                            <option value="LATAO">LATAO</option>
                                            <option value="BRONZE">BRONZE</option>
                                            <option value="ZINCO">ZINCO</option>
                                        </select>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                            Quantidade (Toneladas)
                                        </label>
                                        <input
                                            type="number"
                                            id="quantity"
                                            name="quantity_tonelada"
                                            min="0"
                                            step="0.1"
                                            value={productData.quantity_tonelada}
                                            onChange={(e) => setProductData({...productData, quantity_tonelada: e.target.value})}
                                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? 'Salvando...' : 'Salvar Produto'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Lista de Produtos */}
                    <div className="px-6 py-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Meus Produtos</h3>
                        
                        {loading && userProducts.length === 0 ? (
                            <div className="text-center py-8">
                                <p>Carregando produtos...</p>
                            </div>
                        ) : userProducts.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Você ainda não possui produtos cadastrados.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {userProducts.map((product) => (
                                    <ProductCard 
                                        key={product.id} 
                                        product={product} 
                                        onDelete={handleDeleteProduct}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;