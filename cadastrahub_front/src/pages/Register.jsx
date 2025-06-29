import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        cpfCnpj: '',
        address: '',
        phone: '',
        category: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          await axios.post('http://localhost:3001/api/users', formData);
          toast.success('Cadastro realizado com sucesso!');
          navigate('/');
        } catch (err) {
          const error = err.response?.data?.error;
      
          const errorMessages = {
            'Invalid phone': 'Telefone inválido. Use 11 dígitos, apenas números.',
            'Phone already exists': 'Este telefone já está em uso.',
            'Invalid CPF/CNPJ': 'CPF ou CNPJ inválido.',
            'CPF/CNPJ already exists': 'CPF ou CNPJ já está em uso.',
            'Invalid email': 'E-mail inválido.',
            'Email already exists': 'Este e-mail já está cadastrado.'
          };
      
          toast.error(errorMessages[error] || 'Erro ao registrar. Verifique os dados e tente novamente.');
        } finally {
          setLoading(false);
        }
      };
      

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Criar uma conta</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Já tem uma conta? <Link to="/" className="font-medium text-blue-600 hover:text-blue-500">Faça login</Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome completo</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                minLength="6"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>

                        <div>
                            <label htmlFor="cpfCnpj" className="block text-sm font-medium text-gray-700">CPF/CNPJ</label>
                            <input
                                type="text"
                                id="cpfCnpj"
                                name="cpfCnpj"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={formData.cpfCnpj}
                                onChange={(e) => setFormData({...formData, cpfCnpj: e.target.value})}
                            />
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Endereço</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
                            <select
                                id="category"
                                name="category"
                                required
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                <option value="">Selecione a categoria</option>
                                <option value="customer">Cliente</option>
                                <option value="supplier">Fornecedor</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Registrando...' : 'Criar conta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;