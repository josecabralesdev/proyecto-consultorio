const pool = require('../config/db');

// Obtener provincias
const getProvincias = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM PROVINCIAS ORDER BY nombre');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener municipios por provincia
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

// Obtener policlínicos por municipio
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

// Obtener consultorios por policlínico
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

// Obtener todos los consultorios con información completa
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

// Obtener niveles escolares
const getNivelesEscolares = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM NIVELES_ESCOLARES ORDER BY id_nivel');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener ocupaciones
const getOcupaciones = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM OCUPACIONES ORDER BY descripcion');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener grupos dispensariales
const getGruposDispensariales = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM GRUPOS_DISPENSARIALES ORDER BY id_grupo');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener sexos
const getSexos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM SEXOS ORDER BY id_sexo');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener áreas geográficas del consultorio
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

// Crear área geográfica
const createAreaGeografica = async (req, res) => {
  const { nombre } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO AREAS_GEOGRAFICAS (nombre, id_consultorio) VALUES ($1, $2) RETURNING *',
      [nombre, req.user.id_consultorio]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
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
  getGruposDispensariales,
  getSexos,
  getAreasGeograficas,
  createAreaGeografica
};