import React, { useState, useEffect } from 'react';
import { catalogosAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiCheck, FiMapPin, FiBriefcase } from 'react-icons/fi';

const CatalogManager = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('areas');
  const [areas, setAreas] = useState([]);
  const [ocupaciones, setOcupaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para edición
  const [editingArea, setEditingArea] = useState(null);
  const [editingOcupacion, setEditingOcupacion] = useState(null);
  const [newAreaName, setNewAreaName] = useState('');
  const [newOcupacionName, setNewOcupacionName] = useState('');
  const [editAreaName, setEditAreaName] = useState('');
  const [editOcupacionName, setEditOcupacionName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [areasRes, ocupacionesRes] = await Promise.all([
        catalogosAPI.getAreasGeograficas(),
        catalogosAPI.getOcupaciones()
      ]);
      setAreas(areasRes.data.data);
      setOcupaciones(ocupacionesRes.data.data);
    } catch (error) {
      toast.error('Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  // ==================== ÁREAS GEOGRÁFICAS ====================

  const handleAddArea = async () => {
    if (!newAreaName.trim()) {
      toast.error('Ingrese el nombre del área');
      return;
    }

    try {
      await catalogosAPI.createAreaGeografica({ nombre: newAreaName });
      toast.success('Área geográfica creada');
      setNewAreaName('');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creando área');
    }
  };

  const handleEditArea = async (id) => {
    if (!editAreaName.trim()) {
      toast.error('Ingrese el nombre del área');
      return;
    }

    try {
      await catalogosAPI.updateAreaGeografica(id, { nombre: editAreaName });
      toast.success('Área geográfica actualizada');
      setEditingArea(null);
      setEditAreaName('');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error actualizando área');
    }
  };

  const handleDeleteArea = async (id, nombre) => {
    if (!window.confirm(`¿Está seguro de eliminar el área "${nombre}"?`)) return;

    try {
      await catalogosAPI.deleteAreaGeografica(id);
      toast.success('Área geográfica eliminada');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error eliminando área');
    }
  };

  // ==================== OCUPACIONES ====================

  const handleAddOcupacion = async () => {
    if (!newOcupacionName.trim()) {
      toast.error('Ingrese el nombre de la ocupación');
      return;
    }

    try {
      await catalogosAPI.createOcupacion({ descripcion: newOcupacionName });
      toast.success('Ocupación creada');
      setNewOcupacionName('');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creando ocupación');
    }
  };

  const handleEditOcupacion = async (id) => {
    if (!editOcupacionName.trim()) {
      toast.error('Ingrese el nombre de la ocupación');
      return;
    }

    try {
      await catalogosAPI.updateOcupacion(id, { descripcion: editOcupacionName });
      toast.success('Ocupación actualizada');
      setEditingOcupacion(null);
      setEditOcupacionName('');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error actualizando ocupación');
    }
  };

  const handleDeleteOcupacion = async (id, nombre) => {
    if (!window.confirm(`¿Está seguro de eliminar la ocupación "${nombre}"?`)) return;

    try {
      await catalogosAPI.deleteOcupacion(id);
      toast.success('Ocupación eliminada');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error eliminando ocupación');
    }
  };

  const startEditingArea = (area) => {
    setEditingArea(area.id_area);
    setEditAreaName(area.nombre);
  };

  const startEditingOcupacion = (ocupacion) => {
    setEditingOcupacion(ocupacion.id_ocupacion);
    setEditOcupacionName(ocupacion.descripcion);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            Gestionar Catálogos
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('areas')}
            className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 font-medium transition ${activeTab === 'areas'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <FiMapPin className="h-5 w-5" />
            <span>Áreas Geográficas</span>
            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
              {areas.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('ocupaciones')}
            className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 font-medium transition ${activeTab === 'ocupaciones'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <FiBriefcase className="h-5 w-5" />
            <span>Ocupaciones</span>
            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
              {ocupaciones.length}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'areas' ? (
            <div className="space-y-4">
              {/* Agregar nueva área */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAreaName}
                  onChange={(e) => setNewAreaName(e.target.value)}
                  placeholder="Nueva área geográfica..."
                  className="input-field flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddArea()}
                />
                <button
                  onClick={handleAddArea}
                  className="btn-primary flex items-center space-x-2"
                >
                  <FiPlus className="h-5 w-5" />
                  <span>Agregar</span>
                </button>
              </div>

              {/* Lista de áreas */}
              <div className="space-y-2">
                {areas.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No hay áreas geográficas registradas
                  </p>
                ) : (
                  areas.map((area) => (
                    <div
                      key={area.id_area}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      {editingArea === area.id_area ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={editAreaName}
                            onChange={(e) => setEditAreaName(e.target.value)}
                            className="input-field flex-1"
                            autoFocus
                            onKeyPress={(e) => e.key === 'Enter' && handleEditArea(area.id_area)}
                          />
                          <button
                            onClick={() => handleEditArea(area.id_area)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                          >
                            <FiCheck className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingArea(null);
                              setEditAreaName('');
                            }}
                            className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                          >
                            <FiX className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center space-x-3">
                            <FiMapPin className="h-5 w-5 text-primary-500" />
                            <span className="font-medium">{area.nombre}</span>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => startEditingArea(area)}
                              className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition"
                              title="Editar"
                            >
                              <FiEdit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteArea(area.id_area, area.nombre)}
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
          ) : (
            <div className="space-y-4">
              {/* Agregar nueva ocupación */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newOcupacionName}
                  onChange={(e) => setNewOcupacionName(e.target.value)}
                  placeholder="Nueva ocupación..."
                  className="input-field flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddOcupacion()}
                />
                <button
                  onClick={handleAddOcupacion}
                  className="btn-primary flex items-center space-x-2"
                >
                  <FiPlus className="h-5 w-5" />
                  <span>Agregar</span>
                </button>
              </div>

              {/* Lista de ocupaciones */}
              <div className="space-y-2">
                {ocupaciones.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No hay ocupaciones registradas
                  </p>
                ) : (
                  ocupaciones.map((ocupacion) => (
                    <div
                      key={ocupacion.id_ocupacion}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      {editingOcupacion === ocupacion.id_ocupacion ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={editOcupacionName}
                            onChange={(e) => setEditOcupacionName(e.target.value)}
                            className="input-field flex-1"
                            autoFocus
                            onKeyPress={(e) => e.key === 'Enter' && handleEditOcupacion(ocupacion.id_ocupacion)}
                          />
                          <button
                            onClick={() => handleEditOcupacion(ocupacion.id_ocupacion)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                          >
                            <FiCheck className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingOcupacion(null);
                              setEditOcupacionName('');
                            }}
                            className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                          >
                            <FiX className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center space-x-3">
                            <FiBriefcase className="h-5 w-5 text-primary-500" />
                            <span className="font-medium">{ocupacion.descripcion}</span>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => startEditingOcupacion(ocupacion)}
                              className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition"
                              title="Editar"
                            >
                              <FiEdit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOcupacion(ocupacion.id_ocupacion, ocupacion.descripcion)}
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
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full btn-secondary"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogManager;