const pool = require('../config/db');

// ==================== PROVINCIAS ====================

const getProvincias = async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT p.*, 
                   COUNT(m.id_municipio) as total_municipios
            FROM PROVINCIAS p
            LEFT JOIN MUNICIPIOS m ON p.id_provincia = m.id_provincia
            GROUP BY p.id_provincia
            ORDER BY p.nombre
        `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProvincia = async (req, res) => {
  const { nombre } = req.body;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ success: false, message: 'El nombre es requerido' });
  }

  try {
    const exists = await pool.query(
      'SELECT * FROM PROVINCIAS WHERE LOWER(nombre) = LOWER($1)',
      [nombre.trim()]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Ya existe una provincia con ese nombre' });
    }

    const result = await pool.query(
      'INSERT INTO PROVINCIAS (nombre) VALUES ($1) RETURNING *',
      [nombre.trim()]
    );

    res.status(201).json({ success: true, data: result.rows[0], message: 'Provincia creada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProvincia = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ success: false, message: 'El nombre es requerido' });
  }

  try {
    const exists = await pool.query(
      'SELECT * FROM PROVINCIAS WHERE LOWER(nombre) = LOWER($1) AND id_provincia != $2',
      [nombre.trim(), id]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Ya existe una provincia con ese nombre' });
    }

    const result = await pool.query(
      'UPDATE PROVINCIAS SET nombre = $1 WHERE id_provincia = $2 RETURNING *',
      [nombre.trim(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Provincia no encontrada' });
    }

    res.json({ success: true, data: result.rows[0], message: 'Provincia actualizada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProvincia = async (req, res) => {
  const { id } = req.params;

  try {
    const municipios = await pool.query(
      'SELECT COUNT(*) FROM MUNICIPIOS WHERE id_provincia = $1',
      [id]
    );

    if (parseInt(municipios.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar. Hay ${municipios.rows[0].count} municipio(s) asociado(s)`
      });
    }

    const result = await pool.query(
      'DELETE FROM PROVINCIAS WHERE id_provincia = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Provincia no encontrada' });
    }

    res.json({ success: true, message: 'Provincia eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== MUNICIPIOS ====================

const getMunicipios = async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT m.*, 
                   p.nombre as provincia,
                   COUNT(pol.id_policlinico) as total_policlinicos
            FROM MUNICIPIOS m
            JOIN PROVINCIAS p ON m.id_provincia = p.id_provincia
            LEFT JOIN POLICLINICOS pol ON m.id_municipio = pol.id_municipio
            GROUP BY m.id_municipio, p.nombre
            ORDER BY p.nombre, m.nombre
        `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMunicipiosByProvincia = async (req, res) => {
  const { provinciaId } = req.params;
  try {
    const result = await pool.query(`
            SELECT m.*, 
                   COUNT(pol.id_policlinico) as total_policlinicos
            FROM MUNICIPIOS m
            LEFT JOIN POLICLINICOS pol ON m.id_municipio = pol.id_municipio
            WHERE m.id_provincia = $1
            GROUP BY m.id_municipio
            ORDER BY m.nombre
        `, [provinciaId]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createMunicipio = async (req, res) => {
  const { nombre, id_provincia } = req.body;

  if (!nombre || nombre.trim() === '' || !id_provincia) {
    return res.status(400).json({ success: false, message: 'Nombre y provincia son requeridos' });
  }

  try {
    const exists = await pool.query(
      'SELECT * FROM MUNICIPIOS WHERE LOWER(nombre) = LOWER($1) AND id_provincia = $2',
      [nombre.trim(), id_provincia]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Ya existe un municipio con ese nombre en esta provincia' });
    }

    const result = await pool.query(
      'INSERT INTO MUNICIPIOS (nombre, id_provincia) VALUES ($1, $2) RETURNING *',
      [nombre.trim(), id_provincia]
    );

    res.status(201).json({ success: true, data: result.rows[0], message: 'Municipio creado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateMunicipio = async (req, res) => {
  const { id } = req.params;
  const { nombre, id_provincia } = req.body;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ success: false, message: 'El nombre es requerido' });
  }

  try {
    const result = await pool.query(
      'UPDATE MUNICIPIOS SET nombre = $1, id_provincia = COALESCE($2, id_provincia) WHERE id_municipio = $3 RETURNING *',
      [nombre.trim(), id_provincia, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Municipio no encontrado' });
    }

    res.json({ success: true, data: result.rows[0], message: 'Municipio actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMunicipio = async (req, res) => {
  const { id } = req.params;

  try {
    const policlinicos = await pool.query(
      'SELECT COUNT(*) FROM POLICLINICOS WHERE id_municipio = $1',
      [id]
    );

    if (parseInt(policlinicos.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar. Hay ${policlinicos.rows[0].count} policlínico(s) asociado(s)`
      });
    }

    const result = await pool.query(
      'DELETE FROM MUNICIPIOS WHERE id_municipio = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Municipio no encontrado' });
    }

    res.json({ success: true, message: 'Municipio eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== POLICLÍNICOS ====================

const getPoliclinicos = async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT pol.*, 
                   m.nombre as municipio,
                   p.nombre as provincia,
                   COUNT(c.id_consultorio) as total_consultorios
            FROM POLICLINICOS pol
            JOIN MUNICIPIOS m ON pol.id_municipio = m.id_municipio
            JOIN PROVINCIAS p ON m.id_provincia = p.id_provincia
            LEFT JOIN CONSULTORIOS c ON pol.id_policlinico = c.id_policlinico
            GROUP BY pol.id_policlinico, m.nombre, p.nombre
            ORDER BY p.nombre, m.nombre, pol.nombre
        `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPoliclinicosByMunicipio = async (req, res) => {
  const { municipioId } = req.params;
  try {
    const result = await pool.query(`
            SELECT pol.*, 
                   COUNT(c.id_consultorio) as total_consultorios
            FROM POLICLINICOS pol
            LEFT JOIN CONSULTORIOS c ON pol.id_policlinico = c.id_policlinico
            WHERE pol.id_municipio = $1
            GROUP BY pol.id_policlinico
            ORDER BY pol.nombre
        `, [municipioId]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createPoliclinico = async (req, res) => {
  const { nombre, id_municipio } = req.body;

  if (!nombre || nombre.trim() === '' || !id_municipio) {
    return res.status(400).json({ success: false, message: 'Nombre y municipio son requeridos' });
  }

  try {
    const exists = await pool.query(
      'SELECT * FROM POLICLINICOS WHERE LOWER(nombre) = LOWER($1) AND id_municipio = $2',
      [nombre.trim(), id_municipio]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Ya existe un policlínico con ese nombre en este municipio' });
    }

    const result = await pool.query(
      'INSERT INTO POLICLINICOS (nombre, id_municipio) VALUES ($1, $2) RETURNING *',
      [nombre.trim(), id_municipio]
    );

    res.status(201).json({ success: true, data: result.rows[0], message: 'Policlínico creado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePoliclinico = async (req, res) => {
  const { id } = req.params;
  const { nombre, id_municipio } = req.body;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ success: false, message: 'El nombre es requerido' });
  }

  try {
    const result = await pool.query(
      'UPDATE POLICLINICOS SET nombre = $1, id_municipio = COALESCE($2, id_municipio) WHERE id_policlinico = $3 RETURNING *',
      [nombre.trim(), id_municipio, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Policlínico no encontrado' });
    }

    res.json({ success: true, data: result.rows[0], message: 'Policlínico actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deletePoliclinico = async (req, res) => {
  const { id } = req.params;

  try {
    const consultorios = await pool.query(
      'SELECT COUNT(*) FROM CONSULTORIOS WHERE id_policlinico = $1',
      [id]
    );

    if (parseInt(consultorios.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar. Hay ${consultorios.rows[0].count} consultorio(s) asociado(s)`
      });
    }

    const result = await pool.query(
      'DELETE FROM POLICLINICOS WHERE id_policlinico = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Policlínico no encontrado' });
    }

    res.json({ success: true, message: 'Policlínico eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== CONSULTORIOS ====================

const getConsultorios = async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT c.*, 
                   pol.nombre as policlinico,
                   m.nombre as municipio,
                   p.nombre as provincia,
                   COUNT(DISTINCT med.id_medico) as total_medicos,
                   COUNT(DISTINCT pac.id_paciente) as total_pacientes
            FROM CONSULTORIOS c
            JOIN POLICLINICOS pol ON c.id_policlinico = pol.id_policlinico
            JOIN MUNICIPIOS m ON pol.id_municipio = m.id_municipio
            JOIN PROVINCIAS p ON m.id_provincia = p.id_provincia
            LEFT JOIN MEDICOS med ON c.id_consultorio = med.id_consultorio
            LEFT JOIN PACIENTES pac ON c.id_consultorio = pac.id_consultorio
            GROUP BY c.id_consultorio, pol.nombre, m.nombre, p.nombre
            ORDER BY p.nombre, m.nombre, pol.nombre, c.numero
        `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getConsultoriosByPoliclinico = async (req, res) => {
  const { policlinicoId } = req.params;
  try {
    const result = await pool.query(`
            SELECT c.*, 
                   COUNT(DISTINCT med.id_medico) as total_medicos,
                   COUNT(DISTINCT pac.id_paciente) as total_pacientes
            FROM CONSULTORIOS c
            LEFT JOIN MEDICOS med ON c.id_consultorio = med.id_consultorio
            LEFT JOIN PACIENTES pac ON c.id_consultorio = pac.id_consultorio
            WHERE c.id_policlinico = $1
            GROUP BY c.id_consultorio
            ORDER BY c.numero
        `, [policlinicoId]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createConsultorio = async (req, res) => {
  const { numero, id_policlinico } = req.body;

  if (!numero || numero.trim() === '' || !id_policlinico) {
    return res.status(400).json({ success: false, message: 'Número y policlínico son requeridos' });
  }

  try {
    const exists = await pool.query(
      'SELECT * FROM CONSULTORIOS WHERE numero = $1 AND id_policlinico = $2',
      [numero.trim(), id_policlinico]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Ya existe un consultorio con ese número en este policlínico' });
    }

    const result = await pool.query(
      'INSERT INTO CONSULTORIOS (numero, id_policlinico) VALUES ($1, $2) RETURNING *',
      [numero.trim(), id_policlinico]
    );

    res.status(201).json({ success: true, data: result.rows[0], message: 'Consultorio creado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateConsultorio = async (req, res) => {
  const { id } = req.params;
  const { numero, id_policlinico } = req.body;

  if (!numero || numero.trim() === '') {
    return res.status(400).json({ success: false, message: 'El número es requerido' });
  }

  try {
    const result = await pool.query(
      'UPDATE CONSULTORIOS SET numero = $1, id_policlinico = COALESCE($2, id_policlinico) WHERE id_consultorio = $3 RETURNING *',
      [numero.trim(), id_policlinico, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Consultorio no encontrado' });
    }

    res.json({ success: true, data: result.rows[0], message: 'Consultorio actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteConsultorio = async (req, res) => {
  const { id } = req.params;

  try {
    const medicos = await pool.query(
      'SELECT COUNT(*) FROM MEDICOS WHERE id_consultorio = $1',
      [id]
    );

    if (parseInt(medicos.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar. Hay ${medicos.rows[0].count} médico(s) asociado(s)`
      });
    }

    const pacientes = await pool.query(
      'SELECT COUNT(*) FROM PACIENTES WHERE id_consultorio = $1',
      [id]
    );

    if (parseInt(pacientes.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar. Hay ${pacientes.rows[0].count} paciente(s) asociado(s)`
      });
    }

    const result = await pool.query(
      'DELETE FROM CONSULTORIOS WHERE id_consultorio = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Consultorio no encontrado' });
    }

    res.json({ success: true, message: 'Consultorio eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ESTADÍSTICAS ====================

const getEstadisticas = async (req, res) => {
  try {
    const stats = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM PROVINCIAS) as total_provincias,
                (SELECT COUNT(*) FROM MUNICIPIOS) as total_municipios,
                (SELECT COUNT(*) FROM POLICLINICOS) as total_policlinicos,
                (SELECT COUNT(*) FROM CONSULTORIOS) as total_consultorios,
                (SELECT COUNT(*) FROM MEDICOS) as total_medicos,
                (SELECT COUNT(*) FROM PACIENTES) as total_pacientes
        `);

    res.json({ success: true, data: stats.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  // Provincias
  getProvincias,
  createProvincia,
  updateProvincia,
  deleteProvincia,
  // Municipios
  getMunicipios,
  getMunicipiosByProvincia,
  createMunicipio,
  updateMunicipio,
  deleteMunicipio,
  // Policlínicos
  getPoliclinicos,
  getPoliclinicosByMunicipio,
  createPoliclinico,
  updatePoliclinico,
  deletePoliclinico,
  // Consultorios
  getConsultorios,
  getConsultoriosByPoliclinico,
  createConsultorio,
  updateConsultorio,
  deleteConsultorio,
  // Estadísticas
  getEstadisticas
};