import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="text-center py-20">
            <h1 className="text-6xl font-extrabold text-red-500">404</h1>
            <h2 className="text-3xl font-semibold text-gray-800 mt-4">Página não encontrada</h2>
            <p className="text-gray-600 mt-2">A página que você está procurando não existe ou foi movida.</p>
            <Link to="/" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                Voltar para a Home
            </Link>
        </div>
    );
};

export default NotFound;