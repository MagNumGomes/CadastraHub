import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          CadastraHub
        </Link>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="px-3 py-2 text-gray-700 hover:text-blue-600">
                Meu Perfil
              </Link>
              <button 
                onClick={logout}
                className="px-3 py-2 text-gray-700 hover:text-red-600"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="px-3 py-2 text-gray-700 hover:text-blue-600">
                Entrar
              </Link>
              <Link to="/register" className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Cadastre-se
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;