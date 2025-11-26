const pool = require('../config/db');

// Obtener todos los pacientes del consultorio del médico
const getPacientes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, 
                    ne.descripcion as nivel_escolar,
                    o.descripcion as ocupacion,
                    gd.descripcion as grupo_dispensarial,
                    ag.nombre as area_geografica,
                    s.descripcion as sexo_descripcion
             FROM PACIENTES p
             LEFT JOIN NIVELES_ESCOLARES ne ON p.id_nivel_escolar = ne.id_nivel
             LEFT JOIN OCUPACIONES o ON p.id_ocupacion = o.id_ocupacion
             LEFT JOIN GRUPOS_DISPENSARIALES gd ON p.id_grupo_dispensarial = gd.id_grupo
             LEFT JOIN AREAS_GEOGRAFICAS ag ON p.id_area_geografica = ag.id_area
             LEFT JOIN SEXOS s ON p.sexo = s.codigo
             WHERE p.id_consultorio = $1
             ORDER BY p.nombre_apellidos`,
      [req.user.id_consultorio]
    );

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error obteniendo pacientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener pacientes',
      error: error.message
    });
  }
};

// Obtener un paciente por ID
const getPaciente = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT p.*, 
                    ne.descripcion as nivel_escolar,
                    o.descripcion as ocupacion,
                    gd.descripcion as grupo_dispensarial,
                    ag.nombre as area_geografica
             FROM PACIENTES p
             LEFT JOIN NIVELES_ESCOLARES ne ON p.id_nivel_escolar = ne.id_nivel
             LEFT JOIN OCUPACIONES o ON p.id_ocupacion = o.id_ocupacion
             LEFT JOIN GRUPOS_DISPENSARIALES gd ON p.id_grupo_dispensarial = gd.id_grupo
             LEFT JOIN AREAS_GEOGRAFICAS ag ON p.id_area_geografica = ag.id_area
             WHERE p.id_paciente = $1 AND p.id_consultorio = $2`,
      [id, req.user.id_consultorio]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener paciente',
      error: error.message
    });
  }
};

// Crear nuevo paciente
const createPaciente = async (req, res) => {
  const {
    numero_historia_clinica,
    nombre_apellidos,
    carnet_identidad,
    sexo,
    direccion,
    id_area_geografica,
    id_nivel_escolar,
    id_ocupacion,
    id_grupo_dispensarial,
    problemas_salud,
    observaciones
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO PACIENTES 
             (numero_historia_clinica, nombre_apellidos, carnet_identidad, sexo, 
              direccion, id_area_geografica, id_nivel_escolar, id_ocupacion, 
              id_grupo_dispensarial, problemas_salud, observaciones, id_consultorio)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
             RETURNING *`,
      [
        numero_historia_clinica,
        nombre_apellidos,
        carnet_identidad || null,
        sexo || null,
        direccion || null,
        id_area_geografica || null,
        id_nivel_escolar || null,
        id_ocupacion || null,
        id_grupo_dispensarial || null,
        problemas_salud || null,
        observaciones || null,
        req.user.id_consultorio
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Paciente creado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creando paciente:', error);

    if (error.code === '23505') { // Unique violation
      return res.status(400).json({
        success: false,
        message: 'Ya existe un paciente con ese carnet de identidad'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear paciente',
      error: error.message
    });
  }
};

// Actualizar paciente
const updatePaciente = async (req, res) => {
  const { id } = req.params;
  const {
    numero_historia_clinica,
    nombre_apellidos,
    carnet_identidad,
    sexo,
    direccion,
    id_area_geografica,
    id_nivel_escolar,
    id_ocupacion,
    id_grupo_dispensarial,
    problemas_salud,
    observaciones
  } = req.body;

  try {
    // Verificar que el paciente pertenece al consultorio del médico
    const check = await pool.query(
      'SELECT * FROM PACIENTES WHERE id_paciente = $1 AND id_consultorio = $2',
      [id, req.user.id_consultorio]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado o no tiene permiso'
      });
    }

    const result = await pool.query(
      `UPDATE PACIENTES SET
                numero_historia_clinica = $1,
                nombre_apellidos = $2,
                carnet_identidad = $3,
                sexo = $4,
                direccion = $5,
                id_area_geografica = $6,
                id_nivel_escolar = $7,
                id_ocupacion = $8,
                id_grupo_dispensarial = $9,
                problemas_salud = $10,
                observaciones = $11
             WHERE id_paciente = $12 AND id_consultorio = $13
             RETURNING *`,
      [
        numero_historia_clinica,
        nombre_apellidos,
        carnet_identidad || null,
        sexo || null,
        direccion || null,
        id_area_geografica || null,
        id_nivel_escolar || null,
        id_ocupacion || null,
        id_grupo_dispensarial || null,
        problemas_salud || null,
        observaciones || null,
        id,
        req.user.id_consultorio
      ]
    );

    res.json({
      success: true,
      message: 'Paciente actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error actualizando paciente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar paciente',
      error: error.message
    });
  }
};

// Eliminar paciente
const deletePaciente = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM PACIENTES WHERE id_paciente = $1 AND id_consultorio = $2 RETURNING *',
      [id, req.user.id_consultorio]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado o no tiene permiso'
      });
    }

    res.json({
      success: true,
      message: 'Paciente eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar paciente',
      error: error.message
    });
  }
};

// Buscar pacientes
const searchPacientes = async (req, res) => {
  const { q } = req.query;

  try {
    const result = await pool.query(
      `SELECT p.*, 
                    ne.descripcion as nivel_escolar,
                    o.descripcion as ocupacion,
                    gd.descripcion as grupo_dispensarial
             FROM PACIENTES p
             LEFT JOIN NIVELES_ESCOLARES ne ON p.id_nivel_escolar = ne.id_nivel
             LEFT JOIN OCUPACIONES o ON p.id_ocupacion = o.id_ocupacion
             LEFT JOIN GRUPOS_DISPENSARIALES gd ON p.id_grupo_dispensarial = gd.id_grupo
             WHERE p.id_consultorio = $1 
             AND (
                 LOWER(p.nombre_apellidos) LIKE LOWER($2) OR
                 p.carnet_identidad LIKE $2 OR
                 CAST(p.numero_historia_clinica AS TEXT) LIKE $2
             )
             ORDER BY p.nombre_apellidos`,
      [req.user.id_consultorio, `%${q}%`]
    );

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en búsqueda',
      error: error.message
    });
  }
};

module.exports = {
  getPacientes,
  getPaciente,
  createPaciente,
  updatePaciente,
  deletePaciente,
  searchPacientes
};