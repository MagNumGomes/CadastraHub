import React, { useState } from 'react';

const UserEditModal = ({ user, onClose, onSave }) => {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [role, setRole] = useState(user.role || 'USER');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await onSave({ id: user.id, name, email, role });
      onClose();
    } catch (err) {
      setError('Falha ao salvar usuário.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Editar Usuário</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            Nome:
            <input
              className="w-full border border-gray-300 p-2 rounded mt-1"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="block mb-2">
            Email:
            <input
              className="w-full border border-gray-300 p-2 rounded mt-1"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="block mb-2">
            Role:
            <select
              className="w-full border border-gray-300 p-2 rounded mt-1"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="USER">Usuário</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </label>

          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
