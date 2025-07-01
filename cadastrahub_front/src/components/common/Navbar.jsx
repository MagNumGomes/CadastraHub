import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from './Icons';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" onClick={closeMenu} className="text-2xl font-bold text-blue-600">
              CadastraHub
            </Link>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/insights" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                  <Icon name="insights"/> Insights
                </Link>

                {user?.role === 'admin' && (
                  <>
                    <Link to="/directory" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                      <Icon name="home"/> Diretório
                    </Link>
                    <Link to="/admin" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                      <Icon name="admin"/> Admin
                    </Link>
                  </>
                )}

                <Link to="/profile" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                  <Icon name="profile"/> Meu Perfil
                </Link>
                
                <button onClick={handleLogout} className="bg-red-500 text-white hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium">
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Entrar</Link>
                <Link to="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Cadastre-se</Link>
              </>
            )}
          </div>
          
          {/* Botão Hambúrguer para Mobile */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Abrir menu</span>
              <svg className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              <svg className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Painel do Menu Mobile */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
            <>
              <Link to="/insights" onClick={closeMenu} className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">Insights</Link>
              {user?.role === 'admin' && (
                <>
                    <Link to="/directory" onClick={closeMenu} className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">Diretório</Link>
                    <Link to="/admin" onClick={closeMenu} className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">Admin</Link>
                </>
              )}
              <Link to="/profile" onClick={closeMenu} className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">Meu Perfil</Link>
              <button onClick={handleLogout} className="w-full text-left bg-red-100 text-red-700 block px-3 py-2 rounded-md text-base font-medium">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">Entrar</Link>
              <Link to="/register" onClick={closeMenu} className="bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium">Cadastre-se</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;