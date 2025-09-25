import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Si se requiere un rol específico, verificarlo
    if (requiredRole && parsedUser.role !== requiredRole) {
      navigate('/login');
      return;
    }

    setLoading(false);
  }, [navigate, requiredRole]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: 'white',
        fontSize: '18px'
      }}>
        Verificando autenticación...
      </div>
    );
  }

  return user ? children : null;
};

export default ProtectedRoute;