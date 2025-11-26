import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiHome } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">🏥</span>
              </div>
              <span className="text-xl font-bold text-gray-800">
                Consultorios Médicos
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition"
            >
              <FiHome className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>

            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
              <FiUser className="w-5 h-5 text-gray-600" />
              <div className="text-sm">
                <p className="font-medium text-gray-800">{user?.usuario}</p>
                <p className="text-gray-500 text-xs">
                  {user?.policlinico} - Consultorio {user?.numero_consultorio}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;