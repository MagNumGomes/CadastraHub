import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Profile = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userProducts, setUserProducts] = useState([]);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [productList, setProductList] = useState([]);
  const [productData, setProductData] = useState({
    type: '',
    quantity_tonelada: '',
    subtypeAluminio: '',
    subtypeCobre: ''
  });

  const fetchUserProducts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await api.get('/products');
      setUserProducts(response.data);
    } catch (err) {
      toast.error('Erro ao carregar produtos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserProducts();
    }
  }, [user]);

  const handleAddProductToList = () => {
    if (!productData.type || !productData.quantity_tonelada) {
      return toast.error('Preencha o tipo e a quantidade do material.');
    }
    if (productData.type === 'ALUMINIO' && !productData.subtypeAluminio) {
      return toast.error('Selecione um subtipo para Alumínio.');
    }
    if (productData.type === 'COBRE' && !productData.subtypeCobre) {
      return toast.error('Selecione um subtipo para Cobre.');
    }
    setProductList([...productList, productData]);
    setProductData({ type: '', quantity_tonelada: '', subtypeAluminio: '', subtypeCobre: '' });
    toast.success('Material adicionado à lista.');
  };

  const handleSaveAllProducts = async (e) => {
    e.preventDefault();
    if (productList.length === 0) {
      return toast.error('Adicione ao menos um produto à lista antes de salvar.');
    }
    setLoading(true);
    try {
      await Promise.all(productList.map(product => api.post('/products', product)));
      toast.success('Todos os produtos foram salvos com sucesso!');
      setProductList([]);
      setShowAddProductForm(false);
      await fetchUserProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao salvar produtos.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      setLoading(true);
      try {
        await api.delete(`/products/${productId}`);
        toast.success('Produto removido com sucesso!');
        await fetchUserProducts();
      } catch (err) {
        toast.error('Erro ao remover produto.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }
  if (!user) {
    return <div className="text-center p-8">Usuário não encontrado. Por favor, faça login novamente.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Bloco de Informações do Usuário */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-md text-gray-600">{user.email}</p>
              {user.phone && <p className="text-sm text-gray-500 mt-1">{user.phone}</p>}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 border-t pt-4">
            <button
              onClick={() => setShowAddProductForm(!showAddProductForm)}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              {showAddProductForm ? 'Ocultar Formulário' : 'Adicionar Novo Produto'}
            </button>
            <Link to="/edit-profile" className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition-colors">
              Editar Perfil
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Bloco do Formulário (Condicional) */}
        {showAddProductForm && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSaveAllProducts}>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Cadastrar Materiais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo de Material</label>
                  <select id="type" name="type" value={productData.type} onChange={(e) => setProductData({ ...productData, type: e.target.value, subtypeAluminio: '', subtypeCobre: '' })} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md" required>
                    <option value="">Selecione...</option>
                    <option value="ALUMINIO">ALUMINIO</option>
                    <option value="COBRE">COBRE</option>
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
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantidade (Toneladas)</label>
                  <input type="number" id="quantity" name="quantity_tonelada" min="0" step="0.1" value={productData.quantity_tonelada} onChange={(e) => setProductData({ ...productData, quantity_tonelada: e.target.value })} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" required />
                </div>
              </div>
              
              {productData.type === 'ALUMINIO' && (
                <div className="mt-4">
                  <label htmlFor="subtypeAluminio" className="block text-sm font-medium text-gray-700">Subtipo de Alumínio</label>
                  <select id="subtypeAluminio" name="subtypeAluminio" value={productData.subtypeAluminio} onChange={(e) => setProductData({ ...productData, subtypeAluminio: e.target.value })} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md" required>
                    <option value="">Selecione o subtipo</option>
                    <option value="P1020">P1020</option>
                    <option value="CABO">Cabo</option>
                    <option value="PERFIL_LIMPO">Perfil limpo</option>
                    <option value="ESTAMPARIA_MOLE_MISTA">Estamparia Mole Mista</option>
                    <option value="PANELA_LIMPA">Panela limpa</option>
                    <option value="RODA">Roda</option>
                    <option value="CHAPA_SOLTA_PRENSADA">Chapa solta/Prensada</option>
                    <option value="PISTAO">Pistão</option>
                    <option value="BLOCO_LIMPO_MISTO">Bloco limpo/misto</option>
                    <option value="LATA_SOLTA">Lata solta</option>
                    <option value="LATA_PRENSADA">Lata prensada</option>
                    <option value="LIGA_SAE_305">Liga SAE 305</option>
                    <option value="LIGA_SAE_306">Liga SAE 306</option>
                    <option value="LIGA_SAE_309_323">Liga SAE 309/323</option>
                    <option value="DEOX">Deox</option>
                    <option value="ZAMAC">Zamac</option>
                    <option value="TARUGO">Tarugo</option>
                    <option value="PERFIL_NOVO">Perfil novo</option>
                    <option value="LAMINADOS">Laminados</option>
                    <option value="LAMINA_6MM">Lâmina 6mm</option>
                    <option value="DISCO">Disco</option>
                  </select>
                </div>
              )}

              {productData.type === 'COBRE' && (
                <div className="mt-4">
                  <label htmlFor="subtypeCobre" className="block text-sm font-medium text-gray-700">Subtipo de Cobre</label>
                  <select id="subtypeCobre" name="subtypeCobre" value={productData.subtypeCobre} onChange={(e) => setProductData({ ...productData, subtypeCobre: e.target.value })} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md" required>
                    <option value="">Selecione o subtipo</option>
                    <option value="COBRE_1A">Cobre 1a.</option>
                    <option value="COBRE_MISTO">Cobre Misto</option>
                    <option value="RADIADOR">Radiador</option>
                    <option value="AL_CU">Al/Cu</option>
                  </select>
                </div>
              )}

              <div className="mt-6 flex justify-end items-center gap-4">
                <button type="button" onClick={handleAddProductToList} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700">
                  Adicionar à Lista
                </button>
                <button type="submit" disabled={loading || productList.length === 0} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:opacity-50">
                  {loading ? 'Salvando...' : `Salvar Lista (${productList.length})`}
                </button>
              </div>
            </form>

            {productList.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h4 className="text-lg font-semibold mb-2">Materiais a serem salvos:</h4>
                <div className="flex flex-wrap gap-2">
                  {productList.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      <span>{item.type}: {item.quantity_tonelada} TON</span>
                      <button onClick={() => setProductList(productList.filter((_, i) => i !== index))} className="text-blue-500 hover:text-blue-700 font-bold">
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bloco da Lista de Produtos */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Meus Materiais Cadastrados</h2>
            {loading ? (
                <LoadingSpinner />
            ) : userProducts.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">Você ainda não possui materiais cadastrados.</p>
                    <p className="text-sm text-gray-400 mt-1">Clique em "Adicionar Novo Produto" para começar.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userProducts.map((product) => (
                        <ProductCard key={product.id} product={product} onDelete={handleDeleteProduct} />
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Profile;