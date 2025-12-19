import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import AdminNavbar from './AdminNavbar';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiGrid } from 'react-icons/fi';

const PoliclinicosManager = () => {
  const [policlinicos, setPoliclinicos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNombre, setNewNombre] = useState('');
  const [newMunicipioId, setNewMunicipioId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [filterMunicipio, setFilterMunicipio] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [policlinicosRes, municipiosRes] = await Promise.all([
        adminAPI.getPoliclinicos(),
        adminAPI.getMunicipios()
      ]);
      setPoliclinicos(policlinicosRes.data.data);
      setMunicipios(municipiosRes.data.data);
    } catch (error) {
      toast.error('Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newNombre.trim() || !newMunicipioId) {
      toast.error('Complete todos los campos');
      return;
    }

    try {
      await adminAPI.createPoliclinico({ nombre: newNombre, id_municipio: newMunicipioId });
      toast.success('Policlínico creado');
      setNewNombre('');
      setNewMunicipioId('');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creando policlínico');
    }
  };

  const handleUpdate = async (id) => {
    if (!editNombre.trim()) {
      toast.error('Ingrese el nombre del policlínico');
      return;
    }

    try {
      await adminAPI.updatePoliclinico(id, { nombre: editNombre });
      toast.success('Policlínico actualizado');
      setEditingId(null);
      setEditNombre('');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error actualizando policlínico');
    }
  };

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Está seguro de eliminar el policlínico "${nombre}"?`)) return;

    try {
      await adminAPI.deletePoliclinico(id);
      toast.success('Policlínico eliminado');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error eliminando policlínico');
    }
  };

  const filteredPoliclinicos = filterMunicipio
    ? policlinicos.filter(p => p.id_municipio === parseInt(filterMunicipio))
    : policlinicos;

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
            <FiGrid className="text-purple-600" />
            <span>Gestión de Policlínicos</span>
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Formulario para agregar */}
          <div className="flex flex-col md:flex-row gap-2 mb-6">
            <select
              value={newMunicipioId}
              onChange={(e) => setNewMunicipioId(e.target.value)}
              className="input-field md:w-64"
            >
              <option value="">Seleccione Municipio</option>
              {municipios.map(m => (
                <option key={m.id_municipio} value={m.id_municipio}>
                  {m.nombre} ({m.provincia})
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newNombre}
              onChange={(e) => setNewNombre(e.target.value)}
              placeholder="Nombre del nuevo policlínico..."
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
              value={filterMunicipio}
              onChange={(e) => setFilterMunicipio(e.target.value)}
              className="input-field w-full md:w-64"
            >
              <option value="">Todos los municipios</option>
              {municipios.map(m => (
                <option key={m.id_municipio} value={m.id_municipio}>
                  {m.nombre} ({m.provincia})
                </option>
              ))}
            </select>
          </div>

          {/* Lista */}
          <div className="space-y-2">
            {filteredPoliclinicos.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay policlínicos registrados</p>
            ) : (
              filteredPoliclinicos.map((policlinico) => (
                <div
                  key={policlinico.id_policlinico}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  {editingId === policlinico.id_policlinico ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        className="input-field flex-1"
                        autoFocus
                        onKeyPress={(e) => e.key === 'Enter' && handleUpdate(policlinico.id_policlinico)}
                      />
                      <button
                        onClick={() => handleUpdate(policlinico.id_policlinico)}
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
                        <FiGrid className="h-5 w-5 text-purple-500" />
                        <div>
                          <span className="font-medium">{policlinico.nombre}</span>
                          <span className="ml-2 text-sm text-gray-500">
                            ({policlinico.municipio}, {policlinico.provincia})
                          </span>
                          <span className="ml-2 text-xs text-gray-400">
                            {policlinico.total_consultorios} consultorios
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => {
                            setEditingId(policlinico.id_policlinico);
                            setEditNombre(policlinico.nombre);
                          }}
                          className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition"
                          title="Editar"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(policlinico.id_policlinico, policlinico.nombre)}
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

export default PoliclinicosManager;