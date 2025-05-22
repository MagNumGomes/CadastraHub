import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [showAddProductForm, setShowAddProductForm] = useState(false);
    const [productType, setProductType] = useState('');
    const [quantity, setQuantity] = useState('');
    const navigate = useNavigate();

    const [userProducts, setUserProducts] = useState([]);
    const [showProducts, setShowProducts] = useState(false);

    // Carregar perfil do usuário
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Token inválido ou expirado.');
                    return navigate('/login');
                }

                const response = await axios.get('http://localhost:3001/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUser(response.data.user);
            } catch (err) {
                setError('Erro ao carregar perfil. Faça login novamente.');
                console.error(err);
            }
        };

        fetchProfile();
    }, [navigate]);

    // Logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Função para adicionar produto
    console.log("Usuário atual:", user);
    const handleAddProduct = async (e) => {
        e.preventDefault();

        if (!productType || !quantity) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:3001/api/users/${user.id}/products`, 
                { type: productType, quantity_tonelada: parseFloat(quantity) },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('Produto adicionado:', response.data);
            setShowAddProductForm(false);  // Fechar o formulário
            alert('Produto adicionado com sucesso!');
        } catch (err) {
            console.log('Erro ao adicionar produto:', err);
        }
    };
    console.log(`POST para /api/users/${user?.id}/products`);

    // Função para buscar os produtos do usuário
    const handleFetchProducts = async () => {
        if (!showProducts && userProducts.length === 0) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3001/api/users/${user.id}/products`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                setUserProducts(response.data);
            } catch (err) {
                console.error('Erro ao buscar produtos:', err);
            }
        }
    
        // Alternar visibilidade
        setShowProducts(!showProducts);
    };
    

    if (error) return <p>{error}</p>;
    if (!user) return <p>Carregando...</p>;

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Perfil do Usuário</h1>
            
            <p><strong>Nome:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>

            <button
                onClick={handleLogout}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
                Logout
            </button>

<button
    onClick={handleFetchProducts}
    className="bg-purple-600 text-white px-4 py-2 rounded"
>
    {showProducts ? 'Esconder Produtos' : 'Ver Meus Produtos'}
</button>

            {/* Exibir os produtos do usuário */}
            {showProducts && userProducts.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-lg font-bold mb-2">Meus Produtos</h2>
                    <ul>
                        {userProducts.map((product) => (
                            <li key={product.id}>
                                <strong>Tipo:</strong> {product.type} | <strong>Quantidade:</strong> {product.quantity_tonelada} TON
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Caso não tenha produtos */}
            {showProducts && userProducts.length === 0 && (
                <p className="mt-4 text-gray-600">Você ainda não adicionou produtos.</p>
            )}

            {/* Botão para exibir o formulário de adicionar produto */}
            <button
                onClick={() => setShowAddProductForm(!showAddProductForm)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
                {showAddProductForm ? 'Cancelar' : 'Adicionar Produto'}
            </button>

            {/* Formulário de adicionar produto */}
            {showAddProductForm && (
                <form onSubmit={handleAddProduct} className="mt-4">
                    <div>
                        <label>Tipo de Material</label>
                        <select
                            value={productType}
                            onChange={(e) => setProductType(e.target.value)}
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

                    <div>
                        <label>Quantidade em Toneladas</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            min="0"
                            step="0.1"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-green-600 text-white py-2">
                        Adicionar Produto
                    </button>
                </form>
            )}
        </div>
    );
};

export default Profile;
