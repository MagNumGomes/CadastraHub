import React from 'react';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product, onDelete }) => {
    const materialColors = {
        COBRE: 'bg-orange-100 text-orange-800',
        ALUMINIO: 'bg-gray-100 text-gray-800',
        CHUMBO: 'bg-gray-300 text-gray-900',
        MAGNESIO: 'bg-purple-100 text-purple-800',
        NICKEL: 'bg-green-100 text-green-800',
        INOX: 'bg-blue-100 text-blue-800',
        LATAO: 'bg-yellow-100 text-yellow-800',
        BRONZE: 'bg-amber-100 text-amber-800',
        ZINCO: 'bg-indigo-100 text-indigo-800'
    };

    const handleDelete = async () => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                await onDelete(product.id);
            } catch (error) {
                toast.error('Erro ao excluir produto');
            }
        }
    };

    return (
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {product.type}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${materialColors[product.type] || 'bg-gray-100 text-gray-800'}`}>
                        {product.type}
                    </span>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-gray-500">
                        Quantidade: <span className="font-semibold">{product.quantity_tonelada} TON</span>
                    </p>

                    {/*
                    <p className="text-sm text-gray-500 mt-1">
                        Cadastrado em: {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                    */}
                    
                </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-end">
                <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Excluir
                </button>
            </div>
        </div>
    );
};

export default ProductCard;