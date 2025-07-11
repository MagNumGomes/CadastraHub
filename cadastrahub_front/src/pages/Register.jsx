import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', cpfCnpj: '', cep: '', address: '', phone: '', category: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleCepBlur = async (e) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length !== 8) return;
        setLoading(true);
        try {
            const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
            if (!response.ok) throw new Error('CEP não encontrado');
            const data = await response.json();
            setFormData(prev => ({ ...prev, address: `${data.street}, ${data.neighborhood}, ${data.city} - ${data.state}` }));
            toast.success('Endereço preenchido!');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleCnpjBlur = async (e) => {
        const cnpj = e.target.value.replace(/\D/g, '');
        if (cnpj.length !== 14) return;
        setLoading(true);
        try {
            const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
            if (!response.ok) throw new Error('CNPJ inválido ou não encontrado na Receita Federal.');
            const data = await response.json();
            setFormData(prev => ({...prev, name: data.razao_social || prev.name, phone: data.ddd_telefone_1 || prev.phone }));
            toast.success('CNPJ válido e dados preenchidos!');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/register', formData);
            toast.success('Cadastro realizado com sucesso!');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erro ao registrar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-lg shadow-xl">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Criar Nova Conta</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Já tem uma conta? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Faça login</Link>
                    </p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input type="text" name="cpfCnpj" placeholder="CPF ou CNPJ (somente números)" onBlur={handleCnpjBlur} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    <input type="text" name="name" placeholder="Nome Completo / Razão Social" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    <input type="password" name="password" placeholder="Senha (mínimo 6 caracteres)" onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    <input type="text" name="phone" placeholder="Telefone" value={formData.phone} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    <input type="text" name="cep" placeholder="CEP (somente números)" onBlur={handleCepBlur} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    <input type="text" name="address" placeholder="Endereço Completo" value={formData.address} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    <select name="category" value={formData.category} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="">Selecione a Categoria</option>
                        <option value="customer">Sou Cliente (Compro sucata)</option>
                        <option value="supplier">Sou Fornecedor (Vendo sucata)</option>
                    </select>
                    <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                        {loading ? 'Validando...' : 'Criar Conta'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;