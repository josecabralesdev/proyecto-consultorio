import React, { useState, useEffect } from 'react';
import { catalogosAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FiSave, FiX } from 'react-icons/fi';

const PatientForm = ({ patient, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    numero_historia_clinica: '',
    nombre_apellidos: '',
    carnet_identidad: '',
    sexo: '',
    direccion: '',
    id_area_geografica: '',
    id_nivel_escolar: '',
    id_ocupacion: '',
    id_grupo_dispensarial: '',
    problemas_salud: '',
    observaciones: ''
  });

  const [catalogos, setCatalogos] = useState({
    sexos: [],
    niveles: [],
    ocupaciones: [],
    grupos: [],
    areas: []
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCatalogos();
    if (patient) {
      setFormData({
        numero_historia_clinica: patient.numero_historia_clinica || '',
        nombre_apellidos: patient.nombre_apellidos || '',
        carnet_identidad: patient.carnet_identidad || '',
        sexo: patient.sexo || '',
        direccion: patient.direccion || '',
        id_area_geografica: patient.id_area_geografica || '',
        id_nivel_escolar: patient.id_nivel_escolar || '',
        id_ocupacion: patient.id_ocupacion || '',
        id_grupo_dispensarial: patient.id_grupo_dispensarial || '',
        problemas_salud: patient.problemas_salud || '',
        observaciones: patient.observaciones || ''
      });
    }
  }, [patient]);

  const loadCatalogos = async () => {
    try {
      const [sexos, niveles, ocupaciones, grupos, areas] = await Promise.all([
        catalogosAPI.getSexos(),
        catalogosAPI.getNivelesEscolares(),
        catalogosAPI.getOcupaciones(),
        catalogosAPI.getGruposDispensariales(),
        catalogosAPI.getAreasGeograficas()
      ]);

      setCatalogos({
        sexos: sexos.data.data,
        niveles: niveles.data.data,
        ocupaciones: ocupaciones.data.data,
        grupos: grupos.data.data,
        areas: areas.data.data
      });
    } catch (error) {
      toast.error('Error cargando catálogos');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.numero_historia_clinica || !formData.nombre_apellidos) {
      toast.error('Número de HC y Nombre son requeridos');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {patient ? 'Editar Paciente' : 'Nuevo Paciente'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <FiX className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número Historia Clínica *
            </label>
            <input
              type="number"
              name="numero_historia_clinica"
              value={formData.numero_historia_clinica}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carnet de Identidad
            </label>
            <input
              type="text"
              name="carnet_identidad"
              value={formData.carnet_identidad}
              onChange={handleChange}
              className="input-field"
              maxLength="11"
              placeholder="Ej: 85010112345"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre y Apellidos *
          </label>
          <input
            type="text"
            name="nombre_apellidos"
            value={formData.nombre_apellidos}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sexo
            </label>
            <select
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Seleccionar...</option>
              {catalogos.sexos.map(s => (
                <option key={s.codigo} value={s.codigo}>
                  {s.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nivel Escolar
            </label>
            <select
              name="id_nivel_escolar"
              value={formData.id_nivel_escolar}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Seleccionar...</option>
              {catalogos.niveles.map(n => (
                <option key={n.id_nivel} value={n.id_nivel}>
                  {n.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ocupación
            </label>
            <select
              name="id_ocupacion"
              value={formData.id_ocupacion}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Seleccionar...</option>
              {catalogos.ocupaciones.map(o => (
                <option key={o.id_ocupacion} value={o.id_ocupacion}>
                  {o.descripcion}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grupo Dispensarial
            </label>
            <select
              name="id_grupo_dispensarial"
              value={formData.id_grupo_dispensarial}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Seleccionar...</option>
              {catalogos.grupos.map(g => (
                <option key={g.id_grupo} value={g.id_grupo}>
                  Grupo {g.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área Geográfica
            </label>
            <select
              name="id_area_geografica"
              value={formData.id_area_geografica}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Seleccionar...</option>
              {catalogos.areas.map(a => (
                <option key={a.id_area} value={a.id_area}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección
          </label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="input-field"
            placeholder="Número de casa o edificio"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Problemas de Salud
          </label>
          <textarea
            name="problemas_salud"
            value={formData.problemas_salud}
            onChange={handleChange}
            rows="3"
            className="input-field"
            placeholder="Describir problemas de salud del paciente..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observaciones
          </label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            rows="2"
            className="input-field"
            placeholder="Observaciones adicionales..."
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <FiSave className="h-5 w-5" />
                <span>{patient ? 'Actualizar' : 'Guardar'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;