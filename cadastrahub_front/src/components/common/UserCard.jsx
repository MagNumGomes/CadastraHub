import React from 'react';
import { Link } from 'react-router-dom';

// O componente agora recebe a propriedade "onDeleteClick" da DirectoryPage
const UserCard = ({ user, onDeleteClick }) => {
  const categoryColor = user.category === 'customer' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';

  return (
    <div className="bg-white rounded-lg shadow p-5 border border-gray-100 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col">
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          {user.role === 'ADMIN' && (
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded-full">
              Admin
            </span>
          )}
        </div>
        <div className="border-t my-3"></div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">{user.cpfCnpj}</p>
          <span className={`text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full ${categoryColor}`}>
            {user.category === 'customer' ? 'Cliente' : 'Fornecedor'}
          </span>
        </div>
      </div>
      
      <div className="mt-5 flex justify-end space-x-3 border-t pt-4">
         <Link 
            to={`/admin/users/${user.id}/edit`} 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Editar
          </Link>
         {/* O botão agora chama a função onDeleteClick, passando os dados do usuário */}
         <button 
            onClick={() => onDeleteClick(user)} 
            className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
          >
            Deletar
          </button>
      </div>
    </div>
  );
};

export default UserCard;