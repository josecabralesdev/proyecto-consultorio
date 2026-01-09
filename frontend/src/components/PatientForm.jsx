import React, { useState, useEffect } from 'react';
import { catalogosAPI } from '../services/api';
import { getBirthInfoFromCI, formatBirthDate } from '../utils/ageCalculator';
import toast from 'react-hot-toast';
import { FiSave, FiX, FiPlus, FiCalendar } from 'react-icons/fi';

const PatientForm = ({ patient, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    numero_historia_clinica: '',
    nombre_apellidos: '',
    carnet_identidad: '',
    id_sexo: '',
    direccion: '',
    id_area_geografica: '',
    id_nivel_escolar: '',
    id_ocupacion: '',
    id_grupo_dispensarial: '',
    id_color_piel: '',
    problemas_salud: '',
    observaciones: ''
  });

  const [catalogos, setCatalogos] = useState({
    sexos: [],
    niveles: [],
    ocupaciones: [],
    grupos: [],
    areas: [],
    coloresPiel: []
  });

  const [loading, setLoading] = useState(false);
  const [showNewArea, setShowNewArea] = useState(false);
  const [showNewOcupacion, setShowNewOcupacion] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [newOcupacionName, setNewOcupacionName] = useState('');

  // Estado para la información de edad calculada
  const [birthInfo, setBirthInfo] = useState({
    fechaNacimiento: null,
    edad: null,
    edadTexto: null
  });

  useEffect(() => {
    loadCatalogos();
    if (patient) {
      setFormData({
        numero_historia_clinica: patient.numero_historia_clinica || '',
        nombre_apellidos: patient.nombre_apellidos || '',
        carnet_identidad: patient.carnet_identidad || '',
        id_sexo: patient.id_sexo || '',
        direccion: patient.direccion || '',
        id_area_geografica: patient.id_area_geografica || '',
        id_nivel_escolar: patient.id_nivel_escolar || '',
        id_ocupacion: patient.id_ocupacion || '',
        id_grupo_dispensarial: patient.id_grupo_dispensarial || '',
        id_color_piel: patient.id_color_piel || '',
        problemas_salud: patient.problemas_salud || '',
        observaciones: patient.observaciones || ''
      });
      // Calcular edad inicial si hay CI
      if (patient.carnet_identidad) {
        const info = getBirthInfoFromCI(patient.carnet_identidad);
        setBirthInfo(info);
      }
    }
  }, [patient]);

  const loadCatalogos = async () => {
    try {
      const [sexos, niveles, ocupaciones, grupos, areas, coloresPiel] = await Promise.all([
        catalogosAPI.getSexos(),
        catalogosAPI.getNivelesEscolares(),
        catalogosAPI.getOcupaciones(),
        catalogosAPI.getGruposDispensariales(),
        catalogosAPI.getAreasGeograficas(),
        catalogosAPI.getColoresPiel()
      ]);

      setCatalogos({
        sexos: sexos.data.data,
        niveles: niveles.data.data,
        ocupaciones: ocupaciones.data.data,
        grupos: grupos.data.data,
        areas: areas.data.data,
        coloresPiel: coloresPiel.data.data
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

    // Si cambia el carnet de identidad, recalcular la edad
    if (name === 'carnet_identidad') {
      const info = getBirthInfoFromCI(value);
      setBirthInfo(info);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.numero_historia_clinica || !formData.nombre_apellidos) {
      toast.error('Número de HC y Nombre son requeridos');
      return;
    }

    // Validar formato del CI si se proporciona
    if (formData.carnet_identidad && formData.carnet_identidad.length !== 11) {
      toast.error('El carnet de identidad debe tener 11 dígitos');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleAddArea = async () => {
    if (!newAreaName.trim()) {
      toast.error('Ingrese el nombre del área');
      return;
    }

    try {
      const response = await catalogosAPI.createAreaGeografica({ nombre: newAreaName });
      toast.success('Área geográfica creada');
      setNewAreaName('');
      setShowNewArea(false);
      await loadCatalogos();
      setFormData(prev => ({ ...prev, id_area_geografica: response.data.data.id_area }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creando área');
    }
  };

  const handleAddOcupacion = async () => {
    if (!newOcupacionName.trim()) {
      toast.error('Ingrese el nombre de la ocupación');
      return;
    }

    try {
      const response = await catalogosAPI.createOcupacion({ descripcion: newOcupacionName });
      toast.success('Ocupación creada');
      setNewOcupacionName('');
      setShowNewOcupacion(false);
      await loadCatalogos();
      setFormData(prev => ({ ...prev, id_ocupacion: response.data.data.id_ocupacion }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creando ocupación');
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
              placeholder="Ej: 03051578964"
            />
            {/* Mostrar edad calculada */}
            {birthInfo.edad !== null && (
              <div className="mt-2 flex items-center space-x-2 text-sm">
                <FiCalendar className="text-primary-500" />
                <span className="text-gray-600">
                  Fecha de nacimiento: <span className="font-medium">{formatBirthDate(birthInfo.fechaNacimiento)}</span>
                </span>
                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full font-medium">
                  {birthInfo.edadTexto}
                </span>
              </div>
            )}
            {formData.carnet_identidad && formData.carnet_identidad.length >= 7 && birthInfo.edad === null && (
              <p className="mt-1 text-sm text-red-500">
                Carnet de identidad inválido
              </p>
            )}
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
              name="id_sexo"
              value={formData.id_sexo}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Seleccionar...</option>
              {catalogos.sexos.map(s => (
                <option key={s.id_sexo} value={s.id_sexo}>
                  {s.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color de Piel
            </label>
            <select
              name="id_color_piel"
              value={formData.id_color_piel}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Seleccionar...</option>
              {catalogos.coloresPiel.map(c => (
                <option key={c.id_color} value={c.id_color}>
                  {c.descripcion}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ocupación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ocupación
            </label>
            <div className="flex gap-2">
              <select
                name="id_ocupacion"
                value={formData.id_ocupacion}
                onChange={handleChange}
                className="input-field flex-1"
              >
                <option value="">Seleccionar...</option>
                {catalogos.ocupaciones.map(o => (
                  <option key={o.id_ocupacion} value={o.id_ocupacion}>
                    {o.descripcion}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewOcupacion(!showNewOcupacion)}
                className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                title="Agregar nueva ocupación"
              >
                <FiPlus className="h-5 w-5" />
              </button>
            </div>
            {showNewOcupacion && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={newOcupacionName}
                  onChange={(e) => setNewOcupacionName(e.target.value)}
                  placeholder="Nueva ocupación..."
                  className="input-field flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddOcupacion}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Agregar
                </button>
              </div>
            )}
          </div>

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
        </div>

        {/* Área Geográfica */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Área Geográfica
          </label>
          <div className="flex gap-2">
            <select
              name="id_area_geografica"
              value={formData.id_area_geografica}
              onChange={handleChange}
              className="input-field flex-1"
            >
              <option value="">Seleccionar...</option>
              {catalogos.areas.map(a => (
                <option key={a.id_area} value={a.id_area}>
                  {a.nombre}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowNewArea(!showNewArea)}
              className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
              title="Agregar nueva área geográfica"
            >
              <FiPlus className="h-5 w-5" />
            </button>
          </div>
          {showNewArea && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newAreaName}
                onChange={(e) => setNewAreaName(e.target.value)}
                placeholder="Nueva área geográfica..."
                className="input-field flex-1"
              />
              <button
                type="button"
                onClick={handleAddArea}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Agregar
              </button>
            </div>
          )}
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