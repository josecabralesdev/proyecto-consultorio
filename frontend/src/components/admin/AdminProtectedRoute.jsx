import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

const AdminProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdmin();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;