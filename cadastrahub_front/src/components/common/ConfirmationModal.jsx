import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
        <div className="flex items-center">
          <div className="bg-red-100 rounded-full p-3 mr-4">
            <FiAlertTriangle className="text-red-600 h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
        </div>
        <p className="text-sm text-gray-600 my-4">
          {message}
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
          >
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;