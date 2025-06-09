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
  const [productList, setProductList] = useState([]);
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

    if (productList.length === 0) {
      toast.error('Adicione ao menos um produto antes de salvar');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      for (const product of productList) {
        await axios.post(
          `http://localhost:3001/api/users/${user.id}/products`,
          product,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      toast.success('Produtos salvos com sucesso!');
      setProductList([]);
      setShowAddProductForm(false);
      fetchUserProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao salvar produtos');
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
                  {/* Tipo de Material */}
                  <div className="sm:col-span-3">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Tipo de Material
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={productData.type}
                      onChange={(e) => {
                        const selectedType = e.target.value;
                        setProductData({
                          ...productData,
                          type: selectedType,
                          subtypeAluminio: '',
                          subtypeCobre: ''
                        });
                      }}
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

                  {/* Quantidade */}
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
                      onChange={(e) =>
                        setProductData({ ...productData, quantity_tonelada: e.target.value })
                      }
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  {/* Subtipo ALUMINIO */}
                  {productData.type === 'ALUMINIO' && (
                    <div className="sm:col-span-3">
                      <label htmlFor="subtypeAluminio" className="block text-sm font-medium text-gray-700">
                        Subtipo de Alumínio
                      </label>
                      <select
                        id="subtypeAluminio"
                        name="subtypeAluminio"
                        value={productData.subtypeAluminio}
                        onChange={(e) =>
                          setProductData({ ...productData, subtypeAluminio: e.target.value })
                        }
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        required
                      >
                        <option value="">Selecione o subtipo</option>
                        <option value="P1020">P1020</option>
                        <option value="Cabo">Cabo</option>
                        <option value="Perfil limpo">Perfil limpo</option>
                        <option value="Estamparia Mole Mista">Estamparia Mole Mista</option>
                        <option value="Panela limpa">Panela limpa</option>
                        <option value="Roda">Roda</option>
                        <option value="Chapa solta/Prensada">Chapa solta/Prensada</option>
                        <option value="Pistão">Pistão</option>
                        <option value="Bloco limpo/misto">Bloco limpo/misto</option>
                        <option value="Lata solta">Lata solta</option>
                        <option value="Lata prensada">Lata prensada</option>
                        <option value="Liga SAE 305">Liga SAE 305</option>
                        <option value="Liga SAE 306">Liga SAE 306</option>
                        <option value="Liga SAE 309/323">Liga SAE 309/323</option>
                        <option value="Deox">Deox</option>
                        <option value="Zamac">Zamac</option>
                        <option value="Tarugo">Tarugo</option>
                        <option value="Perfil novo">Perfil novo</option>
                        <option value="Laminados">Laminados</option>
                        <option value="Lâmina 6mm">Lâmina 6mm</option>
                        <option value="Disco">Disco</option>
                      </select>
                    </div>
                  )}


                  {/* Subtipo COBRE */}
                  {productData.type === 'COBRE' && (
                    <div className="sm:col-span-3">
                      <label htmlFor="subtypeCobre" className="block text-sm font-medium text-gray-700">
                        Subtipo de Cobre
                      </label>
                      <select
                        id="subtypeCobre"
                        name="subtypeCobre"
                        value={productData.subtypeCobre}
                        onChange={(e) =>
                          setProductData({ ...productData, subtypeCobre: e.target.value })
                        }
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        required
                      >
                        <option value="">Selecione o subtipo</option>
                        <option value="Cobre 1a.">Cobre 1a.</option>
                        <option value="Cobre Misto">Cobre Misto</option>
                        <option value="Radiador">Radiador</option>
                        <option value="Al/Cu">Al/Cu</option>
                      </select>
                    </div>
                  )}

                </div>


                <div className="mt-6 flex justify-between items-center">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      const newProduct = {
                        type: productData.type,
                        quantity_tonelada: parseFloat(productData.quantity_tonelada),
                        subtypeAluminio: productData.type === 'ALUMINIO' ? productData.subtypeAluminio : null,
                        subtypeCobre: productData.type === 'COBRE' ? productData.subtypeCobre : null
                      };

                      if (!newProduct.type || !newProduct.quantity_tonelada) {
                        toast.error('Preencha todos os campos');
                        return;
                      }

                      setProductList([...productList, newProduct]);
                      setProductData({
                        type: '',
                        quantity_tonelada: '',
                        subtypeAluminio: '',
                        subtypeCobre: ''
                      });
                    }}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Adicionar +
                  </button>

                  <button
                    type="submit"
                    disabled={loading || productList.length === 0}
                    className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Salvando...' : 'Salvar todos'}
                  </button>
                </div>
              </form>

              {productList.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="text-md font-semibold mb-2">Produtos adicionados:</h4>
                  <ul className="space-y-2">
                    {productList.map((item, index) => (
                      <li key={index} className="text-sm text-gray-800 flex justify-between items-center">
                        <span>
                          {item.type}
                          {item.subtypeAluminio && ` - ${item.subtypeAluminio}`}
                          {item.subtypeCobre && ` - ${item.subtypeCobre}`} |
                          {item.quantity_tonelada} tonelada(s)
                        </span>
                        <button
                          onClick={() =>
                            setProductList(productList.filter((_, i) => i !== index))
                          }
                          className="text-red-500 text-xs ml-2 hover:underline"
                        >
                          Remover
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}


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