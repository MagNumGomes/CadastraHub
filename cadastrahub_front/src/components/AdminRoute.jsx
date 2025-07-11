// src/components/AdminRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './common/LoadingSpinner';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingSpinner />;
    }
    
    // IMPORTANTE: A lógica de role deve corresponder ao que seu backend retorna.
    // Pode ser user.role, user.isAdmin, user.category, etc.
    if (!isAuthenticated || user?.role !== 'ADMIN') {
        // Redireciona para a home se não for admin
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};

export default AdminRoute;