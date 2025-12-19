import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import AdminNavbar from './AdminNavbar';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiMapPin } from 'react-icons/fi';

const MunicipiosManager = () => {
  const [municipios, setMunicipios] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNombre, setNewNombre] = useState('');
  const [newProvinciaId, setNewProvinciaId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [filterProvincia, setFilterProvincia] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [municipiosRes, provinciasRes] = await Promise.all([
        adminAPI.getMunicipios(),
        adminAPI.getProvincias()
      ]);
      setMunicipios(municipiosRes.data.data);
      setProvincias(provinciasRes.data.data);
    } catch (error) {
      toast.error('Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newNombre.trim() || !newProvinciaId) {
      toast.error('Complete todos los campos');
      return;
    }

    try {
      await adminAPI.createMunicipio({ nombre: newNombre, id_provincia: newProvinciaId });
      toast.success('Municipio creado');
      setNewNombre('');
      setNewProvinciaId('');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creando municipio');
    }
  };

  const handleUpdate = async (id) => {
    if (!editNombre.trim()) {
      toast.error('Ingrese el nombre del municipio');
      return;
    }

    try {
      await adminAPI.updateMunicipio(id, { nombre: editNombre });
      toast.success('Municipio actualizado');
      setEditingId(null);
      setEditNombre('');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error actualizando municipio');
    }
  };

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Está seguro de eliminar el municipio "${nombre}"?`)) return;

    try {
      await adminAPI.deleteMunicipio(id);
      toast.success('Municipio eliminado');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error eliminando municipio');
    }
  };

  const filteredMunicipios = filterProvincia
    ? municipios.filter(m => m.id_provincia === parseInt(filterProvincia))
    : municipios;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <FiMapPin className="text-green-600" />
            <span>Gestión de Municipios</span>
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Formulario para agregar */}
          <div className="flex flex-col md:flex-row gap-2 mb-6">
            <select
              value={newProvinciaId}
              onChange={(e) => setNewProvinciaId(e.target.value)}
              className="input-field md:w-48"
            >
              <option value="">Seleccione Provincia</option>
              {provincias.map(p => (
                <option key={p.id_provincia} value={p.id_provincia}>
                  {p.nombre}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newNombre}
              onChange={(e) => setNewNombre(e.target.value)}
              placeholder="Nombre del nuevo municipio..."
              className="input-field flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            />
            <button
              onClick={handleCreate}
              className="btn-primary flex items-center space-x-2"
            >
              <FiPlus className="h-5 w-5" />
              <span>Agregar</span>
            </button>
          </div>

          {/* Filtro */}
          <div className="mb-4">
            <select
              value={filterProvincia}
              onChange={(e) => setFilterProvincia(e.target.value)}
              className="input-field w-full md:w-64"
            >
              <option value="">Todas las provincias</option>
              {provincias.map(p => (
                <option key={p.id_provincia} value={p.id_provincia}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Lista */}
          <div className="space-y-2">
            {filteredMunicipios.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay municipios registrados</p>
            ) : (
              filteredMunicipios.map((municipio) => (
                <div
                  key={municipio.id_municipio}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  {editingId === municipio.id_municipio ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        className="input-field flex-1"
                        autoFocus
                        onKeyPress={(e) => e.key === 'Enter' && handleUpdate(municipio.id_municipio)}
                      />
                      <button
                        onClick={() => handleUpdate(municipio.id_municipio)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                      >
                        <FiCheck className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditNombre('');
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3">
                        <FiMapPin className="h-5 w-5 text-green-500" />
                        <div>
                          <span className="font-medium">{municipio.nombre}</span>
                          <span className="ml-2 text-sm text-gray-500">
                            ({municipio.provincia})
                          </span>
                          <span className="ml-2 text-xs text-gray-400">
                            {municipio.total_policlinicos} policlínicos
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => {
                            setEditingId(municipio.id_municipio);
                            setEditNombre(municipio.nombre);
                          }}
                          className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition"
                          title="Editar"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(municipio.id_municipio, municipio.nombre)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                          title="Eliminar"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MunicipiosManager;