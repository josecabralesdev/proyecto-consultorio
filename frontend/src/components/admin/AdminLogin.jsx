import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import toast from 'react-hot-toast';
import { FiUser, FiLock, FiLogIn, FiShield } from 'react-icons/fi';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData);
      toast.success('¡Bienvenido Administrador!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
            <FiShield className="text-4xl text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Panel de Administración
          </h2>
          <p className="mt-2 text-gray-400">
            Acceso exclusivo para administradores
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">
                Usuario
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="usuario"
                  name="usuario"
                  type="text"
                  required
                  className="input-field pl-10"
                  placeholder="Usuario administrador"
                  value={formData.usuario}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="contrasena"
                  name="contrasena"
                  type="password"
                  required
                  className="input-field pl-10"
                  placeholder="Contraseña"
                  value={formData.contrasena}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <FiLogIn className="w-5 h-5" />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-primary-600 hover:text-primary-500">
              ← Volver al login de médicos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;