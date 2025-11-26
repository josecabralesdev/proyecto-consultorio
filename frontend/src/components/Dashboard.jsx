import React, { useState, useEffect, useMemo } from 'react';
import { pacientesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import PatientList from './PatientList';
import PatientForm from './PatientForm';
import toast from 'react-hot-toast';
import { FiPlus, FiUsers, FiUserPlus, FiActivity, FiX } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewPatient, setViewPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await pacientesAPI.getAll();
      setPatients(response.data.data);
    } catch (error) {
      toast.error('Error cargando pacientes');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = useMemo(() => {
    if (!searchTerm) return patients;
    const term = searchTerm.toLowerCase();
    return patients.filter(p =>
      p.nombre_apellidos.toLowerCase().includes(term) ||
      p.carnet_identidad?.includes(term) ||
      p.numero_historia_clinica.toString().includes(term)
    );
  }, [patients, searchTerm]);

  const handleCreatePatient = async (data) => {
    try {
      await pacientesAPI.create(data);
      toast.success('Paciente creado exitosamente');
      setShowForm(false);
      loadPatients();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creando paciente');
    }
  };

  const handleUpdatePatient = async (data) => {
    try {
      await pacientesAPI.update(selectedPatient.id_paciente, data);
      toast.success('Paciente actualizado exitosamente');
      setShowForm(false);
      setSelectedPatient(null);
      loadPatients();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error actualizando paciente');
    }
  };

  const handleDeletePatient = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este paciente?')) return;

    try {
      await pacientesAPI.delete(id);
      toast.success('Paciente eliminado');
      loadPatients();
    } catch (error) {
      toast.error('Error eliminando paciente');
    }
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedPatient(null);
  };

  const stats = useMemo(() => {
    const total = patients.length;
    const porSexo = patients.reduce((acc, p) => {
      acc[p.sexo || 'N'] = (acc[p.sexo || 'N'] || 0) + 1;
      return acc;
    }, {});
    const porGrupo = patients.reduce((acc, p) => {
      const grupo = p.grupo_dispensarial || 'Sin grupo';
      acc[grupo] = (acc[grupo] || 0) + 1;
      return acc;
    }, {});
    return { total, porSexo, porGrupo };
  }, [patients]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card flex items-center space-x-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <FiUsers className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Pacientes</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>

          <div className="card flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiUserPlus className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Masculinos</p>
              <p className="text-2xl font-bold text-gray-800">{stats.porSexo.M || 0}</p>
            </div>
          </div>

          <div className="card flex items-center space-x-4">
            <div className="p-3 bg-pink-100 rounded-lg">
              <FiUserPlus className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Femeninos</p>
              <p className="text-2xl font-bold text-gray-800">{stats.porSexo.F || 0}</p>
            </div>
          </div>

          <div className="card flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FiActivity className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Consultorio</p>
              <p className="text-2xl font-bold text-gray-800">#{user?.numero_consultorio}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {!showForm && (
          <div className="mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <FiPlus className="h-5 w-5" />
              <span>Nuevo Paciente</span>
            </button>
          </div>
        )}

        {/* Form or List */}
        {showForm ? (
          <PatientForm
            patient={selectedPatient}
            onSubmit={selectedPatient ? handleUpdatePatient : handleCreatePatient}
            onCancel={handleCancelForm}
          />
        ) : (
          <PatientList
            patients={filteredPatients}
            onEdit={handleEdit}
            onDelete={handleDeletePatient}
            onView={setViewPatient}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        )}

        {/* Patient Detail Modal */}
        {viewPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {viewPatient.nombre_apellidos}
                    </h2>
                    <p className="text-gray-500">
                      HC #{viewPatient.numero_historia_clinica}
                    </p>
                  </div>
                  <button
                    onClick={() => setViewPatient(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Carnet de Identidad</p>
                    <p className="font-medium">{viewPatient.carnet_identidad || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sexo</p>
                    <p className="font-medium">{viewPatient.sexo_descripcion || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nivel Escolar</p>
                    <p className="font-medium">{viewPatient.nivel_escolar || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ocupación</p>
                    <p className="font-medium">{viewPatient.ocupacion || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Grupo Dispensarial</p>
                    <p className="font-medium">{viewPatient.grupo_dispensarial || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Área Geográfica</p>
                    <p className="font-medium">{viewPatient.area_geografica || 'N/A'}</p>
                  </div>
                </div>

                {viewPatient.problemas_salud && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Problemas de Salud</p>
                    <p className="font-medium mt-1 p-3 bg-gray-50 rounded-lg">
                      {viewPatient.problemas_salud}
                    </p>
                  </div>
                )}

                {viewPatient.observaciones && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Observaciones</p>
                    <p className="font-medium mt-1 p-3 bg-gray-50 rounded-lg">
                      {viewPatient.observaciones}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setViewPatient(null);
                      handleEdit(viewPatient);
                    }}
                    className="btn-primary"
                  >
                    Editar Paciente
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;