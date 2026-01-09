import React from 'react';
import { FiEdit2, FiTrash2, FiUser, FiSearch, FiEye } from 'react-icons/fi';

const PatientList = ({ patients, onEdit, onDelete, onView, searchTerm, onSearchChange }) => {
  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Lista de Pacientes ({patients.length})
        </h2>
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar paciente..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {patients.length === 0 ? (
        <div className="text-center py-12">
          <FiUser className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pacientes</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'No se encontraron resultados' : 'Comienza agregando un nuevo paciente'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  HC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carnet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Edad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sexo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grupo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id_paciente} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      #{patient.numero_historia_clinica}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <FiUser className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {patient.nombre_apellidos}
                        </div>
                        <div className="text-sm text-gray-500">
                          {patient.ocupacion || 'Sin ocupación'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.carnet_identidad || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {patient.edad !== null ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {patient.edad} años
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${patient.sexo_codigo === 'M'
                        ? 'bg-blue-100 text-blue-800'
                        : patient.sexo_codigo === 'F'
                          ? 'bg-pink-100 text-pink-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                      {patient.sexo_descripcion || 'N/E'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {patient.grupo_dispensarial || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onView(patient)}
                        className="text-gray-600 hover:text-primary-600 p-2 rounded-lg hover:bg-gray-100 transition"
                        title="Ver detalles"
                      >
                        <FiEye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(patient)}
                        className="text-primary-600 hover:text-primary-900 p-2 rounded-lg hover:bg-primary-50 transition"
                        title="Editar"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(patient.id_paciente)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition"
                        title="Eliminar"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientList;