import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import AdminNavbar from './AdminNavbar';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiLayers } from 'react-icons/fi';

const ConsultoriosManager = () => {
  const [consultorios, setConsultorios] = useState([]);
  const [policlinicos, setPoliclinicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNumero, setNewNumero] = useState('');
  const [newPoliclinicoId, setNewPoliclinicoId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editNumero, setEditNumero] = useState('');
  const [filterPoliclinico, setFilterPoliclinico] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [consultoriosRes, policlinicosRes] = await Promise.all([
        adminAPI.getConsultorios(),
        adminAPI.getPoliclinicos()
      ]);
      setConsultorios(consultoriosRes.data.data);
      setPoliclinicos(policlinicosRes.data.data);
    } catch (error) {
      toast.error('Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newNumero.trim() || !newPoliclinicoId) {
      toast.error('Complete todos los campos');
      return;
    }

    try {
      await adminAPI.createConsultorio({ numero: newNumero, id_policlinico: newPoliclinicoId });
      toast.success('Consultorio creado');
      setNewNumero('');
      setNewPoliclinicoId('');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creando consultorio');
    }
  };

  const handleUpdate = async (id) => {
    if (!editNumero.trim()) {
      toast.error('Ingrese el número del consultorio');
      return;
    }

    try {
      await adminAPI.updateConsultorio(id, { numero: editNumero });
      toast.success('Consultorio actualizado');
      setEditingId(null);
      setEditNumero('');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error actualizando consultorio');
    }
  };

  const handleDelete = async (id, numero) => {
    if (!window.confirm(`¿Está seguro de eliminar el consultorio #${numero}?`)) return;

    try {
      await adminAPI.deleteConsultorio(id);
      toast.success('Consultorio eliminado');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error eliminando consultorio');
    }
  };

  const filteredConsultorios = filterPoliclinico
    ? consultorios.filter(c => c.id_policlinico === parseInt(filterPoliclinico))
    : consultorios;

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
            <FiLayers className="text-orange-600" />
            <span>Gestión de Consultorios</span>
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Formulario para agregar */}
          <div className="flex flex-col md:flex-row gap-2 mb-6">
            <select
              value={newPoliclinicoId}
              onChange={(e) => setNewPoliclinicoId(e.target.value)}
              className="input-field md:w-80"
            >
              <option value="">Seleccione Policlínico</option>
              {policlinicos.map(p => (
                <option key={p.id_policlinico} value={p.id_policlinico}>
                  {p.nombre} ({p.municipio})
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newNumero}
              onChange={(e) => setNewNumero(e.target.value)}
              placeholder="Número del consultorio..."
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
              value={filterPoliclinico}
              onChange={(e) => setFilterPoliclinico(e.target.value)}
              className="input-field w-full md:w-80"
            >
              <option value="">Todos los policlínicos</option>
              {policlinicos.map(p => (
                <option key={p.id_policlinico} value={p.id_policlinico}>
                  {p.nombre} ({p.municipio})
                </option>
              ))}
            </select>
          </div>

          {/* Lista */}
          <div className="space-y-2">
            {filteredConsultorios.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay consultorios registrados</p>
            ) : (
              filteredConsultorios.map((consultorio) => (
                <div
                  key={consultorio.id_consultorio}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  {editingId === consultorio.id_consultorio ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editNumero}
                        onChange={(e) => setEditNumero(e.target.value)}
                        className="input-field flex-1"
                        autoFocus
                        onKeyPress={(e) => e.key === 'Enter' && handleUpdate(consultorio.id_consultorio)}
                      />
                      <button
                        onClick={() => handleUpdate(consultorio.id_consultorio)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                      >
                        <FiCheck className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditNumero('');
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3">
                        <FiLayers className="h-5 w-5 text-orange-500" />
                        <div>
                          <span className="font-medium">Consultorio #{consultorio.numero}</span>
                          <span className="ml-2 text-sm text-gray-500">
                            {consultorio.policlinico} - {consultorio.municipio}
                          </span>
                          <div className="text-xs text-gray-400">
                            {consultorio.total_medicos} médico(s) · {consultorio.total_pacientes} paciente(s)
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => {
                            setEditingId(consultorio.id_consultorio);
                            setEditNumero(consultorio.numero);
                          }}
                          className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition"
                          title="Editar"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(consultorio.id_consultorio, consultorio.numero)}
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

export default ConsultoriosManager;