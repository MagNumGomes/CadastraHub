import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <>
            <div className="bg-white">
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                        Bem-vindo ao <span className="text-blue-600">CadastraHub</span>
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        A plataforma central para gestão de clientes, fornecedores e materiais recicláveis. Simplifique seus processos e ganhe insights valiosos.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                        {isAuthenticated ? (
                            <Link
                                to="/profile"
                                className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                            >
                                Acessar meu Perfil
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/register"
                                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                                >
                                    Cadastre-se Gratuitamente
                                </Link>
                                <Link
                                    to="/login"
                                    className="w-full sm:w-auto px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition duration-300"
                                >
                                    Fazer Login
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="py-12 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Nossos Recursos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-6 bg-white rounded-lg shadow-lg text-center">
                                <h3 className="text-xl font-semibold mb-2">Gestão Unificada</h3>
                                <p className="text-gray-600">Cadastre e gerencie clientes e fornecedores em um único local, com acesso fácil e rápido às informações.</p>
                            </div>
                            <div className="p-6 bg-white rounded-lg shadow-lg text-center">
                                <h3 className="text-xl font-semibold mb-2">Controle de Materiais</h3>
                                <p className="text-gray-600">Registre entradas e saídas de materiais como cobre, alumínio e outros, mantendo seu inventário sempre atualizado.</p>
                            </div>
                            <div className="p-6 bg-white rounded-lg shadow-lg text-center">
                                <h3 className="text-xl font-semibold mb-2">Relatórios e Insights</h3>
                                <p className="text-gray-600">Obtenha relatórios detalhados e estatísticas sobre suas operações para tomar decisões mais inteligentes.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
              <footer className="w-full border-t border-gray-200 py-6 mt-12">
                <div className="container mx-auto text-center">
                    <p className="text-sm text-gray-600">
                        &copy; {new Date().getFullYear()} CadastraHub | Desenvolvido por{' '}
                        <a 
                            href="https://github.com/MagNumGomes" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-semibold text-blue-600 hover:underline"
                        >
                            João Vítor Góes
                        </a>
                        {' e '}
                        <a 
                            href="https://github.com/AlexandreFatec" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-semibold text-blue-600 hover:underline"
                        >
                            Alexandre Ribeiro
                        </a>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Todos os direitos reservados.
                    </p>
                </div>
            </footer>
        </>
    );
};

export default Home;