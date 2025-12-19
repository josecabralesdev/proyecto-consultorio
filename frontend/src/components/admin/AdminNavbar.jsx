import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { FiLogOut, FiShield, FiHome, FiMap, FiMapPin, FiGrid, FiLayers } from 'react-icons/fi';

const AdminNavbar = () => {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/provincias', icon: FiMap, label: 'Provincias' },
    { path: '/admin/municipios', icon: FiMapPin, label: 'Municipios' },
    { path: '/admin/policlinicos', icon: FiGrid, label: 'Policlínicos' },
    { path: '/admin/consultorios', icon: FiLayers, label: 'Consultorios' },
  ];

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/admin/dashboard" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <FiShield className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-white">
                Admin Panel
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition ${isActive
                        ? 'bg-yellow-500 text-gray-900'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg">
              <FiShield className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-white">{admin?.nombre}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition"
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

export default AdminNavbar;