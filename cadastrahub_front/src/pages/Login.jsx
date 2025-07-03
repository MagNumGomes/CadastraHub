import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Login = () => {
    const [values, setValues] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(values.email.trim(), values.password.trim());
            toast.success('Login realizado com sucesso!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Email ou senha inválidos.');
        } finally {
            setLoading(false);
        }
    };

    // Função para preencher os dados de admin para teste rápido
    const handleAdminLoginClick = () => {
        // ATENÇÃO: Use credenciais de admin que existam no seu banco de dados
        setValues({
            email: 'admin@cadastrahub.com',
            password: 'admin123'
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-sm w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Acesse sua conta</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        ou <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">crie uma nova conta</Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="seu@email.com"
                                value={values.email}
                                onChange={(e) => setValues({...values, email: e.target.value})}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="••••••••"
                                value={values.password}
                                onChange={(e) => setValues({...values, password: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm space-y-2 pt-4 border-t border-gray-200">
                    <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                        Esqueci minha senha
                    </Link>
                    <div className="text-gray-400">·</div>
                    <button 
                        type="button"
                        onClick={handleAdminLoginClick}
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        Entrar como Administrador (Dev)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;