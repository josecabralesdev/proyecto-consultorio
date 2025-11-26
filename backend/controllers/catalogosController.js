const pool = require('../config/db');

// ==================== PROVINCIAS, MUNICIPIOS, POLICLINICOS, CONSULTORIOS ====================

const getProvincias = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM PROVINCIAS ORDER BY nombre');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMunicipios = async (req, res) => {
  try {
    const { provinciaId } = req.params;
    const result = await pool.query(
      'SELECT * FROM MUNICIPIOS WHERE id_provincia = $1 ORDER BY nombre',
      [provinciaId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPoliclinicos = async (req, res) => {
  try {
    const { municipioId } = req.params;
    const result = await pool.query(
      'SELECT * FROM POLICLINICOS WHERE id_municipio = $1 ORDER BY nombre',
      [municipioId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getConsultorios = async (req, res) => {
  try {
    const { policlinicoId } = req.params;
    const result = await pool.query(
      'SELECT * FROM CONSULTORIOS WHERE id_policlinico = $1 ORDER BY numero',
      [policlinicoId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllConsultorios = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id_consultorio, c.numero, 
                    p.nombre as policlinico, p.id_policlinico,
                    m.nombre as municipio, m.id_municipio,
                    pr.nombre as provincia, pr.id_provincia
             FROM CONSULTORIOS c
             JOIN POLICLINICOS p ON c.id_policlinico = p.id_policlinico
             JOIN MUNICIPIOS m ON p.id_municipio = m.id_municipio
             JOIN PROVINCIAS pr ON m.id_provincia = pr.id_provincia
             ORDER BY p.nombre, c.numero`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== CATÁLOGOS SIMPLES ====================

const getNivelesEscolares = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM NIVELES_ESCOLARES ORDER BY id_nivel');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getGruposDispensariales = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM GRUPOS_DISPENSARIALES ORDER BY id_grupo');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSexos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM SEXOS ORDER BY id_sexo');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener colores de piel
const getColoresPiel = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM COLORES_PIEL ORDER BY id_color');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ÁREAS GEOGRÁFICAS (CRUD) ====================

const getAreasGeograficas = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM AREAS_GEOGRAFICAS WHERE id_consultorio = $1 ORDER BY nombre',
      [req.user.id_consultorio]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createAreaGeografica = async (req, res) => {
  const { nombre } = req.body;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ success: false, message: 'El nombre es requerido' });
  }

  try {
    // Verificar si ya existe
    const exists = await pool.query(
      'SELECT * FROM AREAS_GEOGRAFICAS WHERE LOWER(nombre) = LOWER($1) AND id_consultorio = $2',
      [nombre.trim(), req.user.id_consultorio]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Ya existe un área con ese nombre' });
    }

    const result = await pool.query(
      'INSERT INTO AREAS_GEOGRAFICAS (nombre, id_consultorio) VALUES ($1, $2) RETURNING *',
      [nombre.trim(), req.user.id_consultorio]
    );
    res.status(201).json({ success: true, data: result.rows[0], message: 'Área geográfica creada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAreaGeografica = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ success: false, message: 'El nombre es requerido' });
  }

  try {
    // Verificar que pertenece al consultorio del médico
    const check = await pool.query(
      'SELECT * FROM AREAS_GEOGRAFICAS WHERE id_area = $1 AND id_consultorio = $2',
      [id, req.user.id_consultorio]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Área no encontrada' });
    }

    // Verificar duplicados
    const exists = await pool.query(
      'SELECT * FROM AREAS_GEOGRAFICAS WHERE LOWER(nombre) = LOWER($1) AND id_consultorio = $2 AND id_area != $3',
      [nombre.trim(), req.user.id_consultorio, id]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Ya existe un área con ese nombre' });
    }

    const result = await pool.query(
      'UPDATE AREAS_GEOGRAFICAS SET nombre = $1 WHERE id_area = $2 AND id_consultorio = $3 RETURNING *',
      [nombre.trim(), id, req.user.id_consultorio]
    );

    res.json({ success: true, data: result.rows[0], message: 'Área geográfica actualizada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteAreaGeografica = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si hay pacientes usando esta área
    const pacientes = await pool.query(
      'SELECT COUNT(*) FROM PACIENTES WHERE id_area_geografica = $1',
      [id]
    );

    if (parseInt(pacientes.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar. Hay ${pacientes.rows[0].count} paciente(s) usando esta área geográfica`
      });
    }

    const result = await pool.query(
      'DELETE FROM AREAS_GEOGRAFICAS WHERE id_area = $1 AND id_consultorio = $2 RETURNING *',
      [id, req.user.id_consultorio]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Área no encontrada' });
    }

    res.json({ success: true, message: 'Área geográfica eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== OCUPACIONES (CRUD) ====================

const getOcupaciones = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM OCUPACIONES ORDER BY descripcion');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createOcupacion = async (req, res) => {
  const { descripcion } = req.body;

  if (!descripcion || descripcion.trim() === '') {
    return res.status(400).json({ success: false, message: 'La descripción es requerida' });
  }

  try {
    // Verificar si ya existe
    const exists = await pool.query(
      'SELECT * FROM OCUPACIONES WHERE LOWER(descripcion) = LOWER($1)',
      [descripcion.trim()]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Ya existe una ocupación con ese nombre' });
    }

    const result = await pool.query(
      'INSERT INTO OCUPACIONES (descripcion) VALUES ($1) RETURNING *',
      [descripcion.trim()]
    );
    res.status(201).json({ success: true, data: result.rows[0], message: 'Ocupación creada' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'Ya existe una ocupación con ese nombre' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOcupacion = async (req, res) => {
  const { id } = req.params;
  const { descripcion } = req.body;

  if (!descripcion || descripcion.trim() === '') {
    return res.status(400).json({ success: false, message: 'La descripción es requerida' });
  }

  try {
    // Verificar duplicados
    const exists = await pool.query(
      'SELECT * FROM OCUPACIONES WHERE LOWER(descripcion) = LOWER($1) AND id_ocupacion != $2',
      [descripcion.trim(), id]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Ya existe una ocupación con ese nombre' });
    }

    const result = await pool.query(
      'UPDATE OCUPACIONES SET descripcion = $1 WHERE id_ocupacion = $2 RETURNING *',
      [descripcion.trim(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ocupación no encontrada' });
    }

    res.json({ success: true, data: result.rows[0], message: 'Ocupación actualizada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteOcupacion = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si hay pacientes usando esta ocupación
    const pacientes = await pool.query(
      'SELECT COUNT(*) FROM PACIENTES WHERE id_ocupacion = $1',
      [id]
    );

    if (parseInt(pacientes.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar. Hay ${pacientes.rows[0].count} paciente(s) con esta ocupación`
      });
    }

    const result = await pool.query(
      'DELETE FROM OCUPACIONES WHERE id_ocupacion = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ocupación no encontrada' });
    }

    res.json({ success: true, message: 'Ocupación eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProvincias,
  getMunicipios,
  getPoliclinicos,
  getConsultorios,
  getAllConsultorios,
  getNivelesEscolares,
  getOcupaciones,
  createOcupacion,
  updateOcupacion,
  deleteOcupacion,
  getGruposDispensariales,
  getSexos,
  getColoresPiel,
  getAreasGeograficas,
  createAreaGeografica,
  updateAreaGeografica,
  deleteAreaGeografica
};