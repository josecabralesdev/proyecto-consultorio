import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { catalogosAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FiUser, FiLock, FiUserPlus } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: '',
    confirmarContrasena: '',
    id_provincia: '',
    id_municipio: '',
    id_policlinico: '',
    id_consultorio: ''
  });
  const [provincias, setProvincias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [policlinicos, setPoliclinicos] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProvincias();
  }, []);

  const loadProvincias = async () => {
    try {
      const response = await catalogosAPI.getProvincias();
      setProvincias(response.data.data);
    } catch (error) {
      toast.error('Error cargando provincias');
    }
  };

  const handleProvinciaChange = async (e) => {
    const id = e.target.value;
    setFormData({ ...formData, id_provincia: id, id_municipio: '', id_policlinico: '', id_consultorio: '' });
    setMunicipios([]);
    setPoliclinicos([]);
    setConsultorios([]);

    if (id) {
      try {
        const response = await catalogosAPI.getMunicipios(id);
        setMunicipios(response.data.data);
      } catch (error) {
        toast.error('Error cargando municipios');
      }
    }
  };

  const handleMunicipioChange = async (e) => {
    const id = e.target.value;
    setFormData({ ...formData, id_municipio: id, id_policlinico: '', id_consultorio: '' });
    setPoliclinicos([]);
    setConsultorios([]);

    if (id) {
      try {
        const response = await catalogosAPI.getPoliclinicos(id);
        setPoliclinicos(response.data.data);
      } catch (error) {
        toast.error('Error cargando policlínicos');
      }
    }
  };

  const handlePoliclinicoChange = async (e) => {
    const id = e.target.value;
    setFormData({ ...formData, id_policlinico: id, id_consultorio: '' });
    setConsultorios([]);

    if (id) {
      try {
        const response = await catalogosAPI.getConsultorios(id);
        setConsultorios(response.data.data);
      } catch (error) {
        toast.error('Error cargando consultorios');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.contrasena !== formData.confirmarContrasena) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (formData.contrasena.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register({
        usuario: formData.usuario,
        contrasena: formData.contrasena,
        id_consultorio: formData.id_consultorio
      });
      toast.success('¡Registro exitoso!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl">👨‍⚕️</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Registro de Médico
          </h2>
          <p className="mt-2 text-primary-100">
            Crea tu cuenta para acceder al sistema
          </p>
        </div>

        <div className="card">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Usuario</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="usuario"
                  type="text"
                  required
                  className="input-field pl-10"
                  placeholder="Nombre de usuario"
                  value={formData.usuario}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="contrasena"
                  type="password"
                  required
                  className="input-field pl-10"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.contrasena}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="confirmarContrasena"
                  type="password"
                  required
                  className="input-field pl-10"
                  placeholder="Repite la contraseña"
                  value={formData.confirmarContrasena}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Ubicación del Consultorio</p>

              <div className="space-y-3">
                <select
                  name="id_provincia"
                  className="input-field"
                  value={formData.id_provincia}
                  onChange={handleProvinciaChange}
                  required
                >
                  <option value="">Seleccione Provincia</option>
                  {provincias.map(p => (
                    <option key={p.id_provincia} value={p.id_provincia}>
                      {p.nombre}
                    </option>
                  ))}
                </select>

                <select
                  name="id_municipio"
                  className="input-field"
                  value={formData.id_municipio}
                  onChange={handleMunicipioChange}
                  required
                  disabled={!formData.id_provincia}
                >
                  <option value="">Seleccione Municipio</option>
                  {municipios.map(m => (
                    <option key={m.id_municipio} value={m.id_municipio}>
                      {m.nombre}
                    </option>
                  ))}
                </select>

                <select
                  name="id_policlinico"
                  className="input-field"
                  value={formData.id_policlinico}
                  onChange={handlePoliclinicoChange}
                  required
                  disabled={!formData.id_municipio}
                >
                  <option value="">Seleccione Policlínico</option>
                  {policlinicos.map(p => (
                    <option key={p.id_policlinico} value={p.id_policlinico}>
                      {p.nombre}
                    </option>
                  ))}
                </select>

                <select
                  name="id_consultorio"
                  className="input-field"
                  value={formData.id_consultorio}
                  onChange={handleChange}
                  required
                  disabled={!formData.id_policlinico}
                >
                  <option value="">Seleccione Consultorio</option>
                  {consultorios.map(c => (
                    <option key={c.id_consultorio} value={c.id_consultorio}>
                      Consultorio #{c.numero}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <FiUserPlus className="w-5 h-5" />
                  <span>Registrarse</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;