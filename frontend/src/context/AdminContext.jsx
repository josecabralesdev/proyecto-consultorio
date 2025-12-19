import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAuthAPI } from '../services/api';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        const response = await adminAuthAPI.getMe();
        setAdmin(response.data.data);
      } catch (error) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    const response = await adminAuthAPI.login(credentials);
    const { token, admin: adminData } = response.data.data;
    localStorage.setItem('adminToken', token);
    localStorage.setItem('admin', JSON.stringify(adminData));
    setAdmin({ ...adminData, isAdmin: true });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin debe usarse dentro de AdminProvider');
  }
  return context;
};