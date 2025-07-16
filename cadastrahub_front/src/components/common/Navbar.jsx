import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, FiUser, FiPieChart, FiLogOut, FiLogIn, FiUserPlus, FiSettings, FiUsers 
} from 'react-icons/fi';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const isAdminSection = user?.role === 'ADMIN' && (
    location.pathname.startsWith('/admin') || location.pathname.startsWith('/directory')
  );

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  const adminMenu = (
    <>
      <Link 
        to="/admin" 
        className="flex items-center px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-lg"
      >
        <FiSettings className="mr-1" /> Dashboard
      </Link>
      <Link 
        to="/directory" 
        className="flex items-center px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-lg"
      >
        <FiUsers className="mr-1" /> Diretório
      </Link>
      <Link 
        to="/profile" 
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border-l ml-2 pl-4"
      >
        <FiUser className="mr-1" /> Sair do modo Admin
      </Link>
    </>
  );

  const userMenu = (
     <>
        <Link 
          to="/insights" 
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <FiPieChart className="mr-1" /> Insights
        </Link>
        <Link 
          to="/profile" 
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <FiUser className="mr-1" /> Perfil
        </Link>
        {user?.role === 'ADMIN' && (
          <Link 
            to="/admin" 
            className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <FiSettings className="mr-1" /> Acessar Admin
          </Link>
        )}
      </>
  );

  return (
    <nav className={`bg-white shadow-md ${isAdminSection ? 'border-b-2 border-blue-600' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to={isAuthenticated ? '/profile' : '/'} 
              className="text-xl font-bold text-blue-600 flex items-center"
            >
              <FiHome className="mr-2" />
              CadastraHub
            </Link>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {/* #3 - Aplicando a lógica no menu desktop */}
                {isAdminSection ? adminMenu : userMenu}
                <button 
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <FiLogOut className="mr-1" /> Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"><FiLogIn className="mr-1" /> Entrar</Link>
                <Link to="/register" className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"><FiUserPlus className="mr-1" /> Cadastrar</Link>
              </>
            )}
          </div>

          {/* Botão Mobile */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-gray-100 focus:outline-none">
              {isMobileMenuOpen ? <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                {/* #4 - Aplicando a mesma lógica no menu mobile */}
                {isAdminSection ? (
                   <>
                    <Link to="/admin" onClick={closeMenu} className="flex items-center px-3 py-2 text-base font-medium text-blue-700 hover:bg-blue-50 rounded-lg"><FiSettings className="mr-2" /> Dashboard</Link>
                    <Link to="/directory" onClick={closeMenu} className="flex items-center px-3 py-2 text-base font-medium text-blue-700 hover:bg-blue-50 rounded-lg"><FiUsers className="mr-2" /> Diretório</Link>
                    <Link to="/profile" onClick={closeMenu} className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg border-t mt-1 pt-2"><FiUser className="mr-2" /> Sair do modo Admin</Link>
                  </>
                ) : (
                   <>
                    <Link to="/insights" onClick={closeMenu} className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg"><FiPieChart className="mr-2" /> Insights</Link>
                    <Link to="/profile" onClick={closeMenu} className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg"><FiUser className="mr-2" /> Perfil</Link>
                    {user?.role === 'ADMIN' && (
                      <Link to="/admin" onClick={closeMenu} className="flex items-center px-3 py-2 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-lg border-t mt-1 pt-2"><FiSettings className="mr-2" /> Acessar Admin</Link>
                    )}
                  </>
                )}
                <button onClick={handleLogout} className="w-full flex items-center px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg mt-1 border-t"><FiLogOut className="mr-2" /> Sair</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg"><FiLogIn className="mr-2" /> Entrar</Link>
                <Link to="/register" onClick={closeMenu} className="flex items-center px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"><FiUserPlus className="mr-2" /> Cadastrar</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;