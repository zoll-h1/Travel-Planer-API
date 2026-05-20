import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

// If true 
  return children;
};

export default ProtectedRoute;
