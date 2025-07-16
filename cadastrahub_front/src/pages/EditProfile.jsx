import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EditProfile = () => {
    const { user, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put('/profile', formData);
            toast.success('Perfil atualizado com sucesso!');
            navigate('/profile');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erro ao atualizar perfil.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || !user) {
        return <LoadingSpinner />;
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Editar Perfil</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo / Razão Social</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
                    <input type="text" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Endereço</label>
                    <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div className="flex gap-4 pt-4">
                    <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                     <button type="button" onClick={() => navigate('/profile')} className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;