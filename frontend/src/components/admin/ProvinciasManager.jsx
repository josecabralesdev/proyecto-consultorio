import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import AdminNavbar from './AdminNavbar';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiMap } from 'react-icons/fi';

const ProvinciasManager = () => {
  const [provincias, setProvincias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNombre, setNewNombre] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editNombre, setEditNombre] = useState('');

  useEffect(() => {
    loadProvincias();
  }, []);

  const loadProvincias = async () => {
    try {
      const response = await adminAPI.getProvincias();
      setProvincias(response.data.data);
    } catch (error) {
      toast.error('Error cargando provincias');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newNombre.trim()) {
      toast.error('Ingrese el nombre de la provincia');
      return;
    }

    try {
      await adminAPI.createProvincia({ nombre: newNombre });
      toast.success('Provincia creada');
      setNewNombre('');
      loadProvincias();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creando provincia');
    }
  };

  const handleUpdate = async (id) => {
    if (!editNombre.trim()) {
      toast.error('Ingrese el nombre de la provincia');
      return;
    }

    try {
      await adminAPI.updateProvincia(id, { nombre: editNombre });
      toast.success('Provincia actualizada');
      setEditingId(null);
      setEditNombre('');
      loadProvincias();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error actualizando provincia');
    }
  };

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Está seguro de eliminar la provincia "${nombre}"?`)) return;

    try {
      await adminAPI.deleteProvincia(id);
      toast.success('Provincia eliminada');
      loadProvincias();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error eliminando provincia');
    }
  };

  const startEditing = (provincia) => {
    setEditingId(provincia.id_provincia);
    setEditNombre(provincia.nombre);
  };

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
            <FiMap className="text-blue-600" />
            <span>Gestión de Provincias</span>
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Formulario para agregar */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newNombre}
              onChange={(e) => setNewNombre(e.target.value)}
              placeholder="Nombre de la nueva provincia..."
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

          {/* Lista */}
          <div className="space-y-2">
            {provincias.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay provincias registradas</p>
            ) : (
              provincias.map((provincia) => (
                <div
                  key={provincia.id_provincia}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  {editingId === provincia.id_provincia ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        className="input-field flex-1"
                        autoFocus
                        onKeyPress={(e) => e.key === 'Enter' && handleUpdate(provincia.id_provincia)}
                      />
                      <button
                        onClick={() => handleUpdate(provincia.id_provincia)}
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
                        <FiMap className="h-5 w-5 text-blue-500" />
                        <div>
                          <span className="font-medium">{provincia.nombre}</span>
                          <span className="ml-2 text-sm text-gray-500">
                            ({provincia.total_municipios} municipios)
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => startEditing(provincia)}
                          className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition"
                          title="Editar"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(provincia.id_provincia, provincia.nombre)}
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

export default ProvinciasManager;