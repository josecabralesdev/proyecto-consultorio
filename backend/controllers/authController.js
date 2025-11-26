const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Registrar nuevo médico
const register = async (req, res) => {
  const { usuario, contrasena, id_consultorio } = req.body;

  try {
    // Verificar si el usuario ya existe
    const userExists = await pool.query(
      'SELECT * FROM MEDICOS WHERE usuario = $1',
      [usuario]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de usuario ya está en uso'
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    // Insertar nuevo médico
    const newUser = await pool.query(
      `INSERT INTO MEDICOS (usuario, contrasena, id_consultorio) 
             VALUES ($1, $2, $3) 
             RETURNING id_medico, usuario, id_consultorio, creado_en`,
      [usuario, hashedPassword, id_consultorio]
    );

    // Generar token
    const token = jwt.sign(
      {
        id_medico: newUser.rows[0].id_medico,
        usuario: newUser.rows[0].usuario,
        id_consultorio: newUser.rows[0].id_consultorio
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Médico registrado exitosamente',
      data: {
        user: newUser.rows[0],
        token
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor',
      error: error.message
    });
  }
};

// Login
const login = async (req, res) => {
  const { usuario, contrasena } = req.body;

  try {
    // Buscar usuario con información del consultorio
    const result = await pool.query(
      `SELECT m.*, c.numero as numero_consultorio, p.nombre as policlinico
             FROM MEDICOS m
             JOIN CONSULTORIOS c ON m.id_consultorio = c.id_consultorio
             JOIN POLICLINICOS p ON c.id_policlinico = p.id_policlinico
             WHERE m.usuario = $1`,
      [usuario]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    const user = result.rows[0];

    // Verificar contraseña
    const validPassword = await bcrypt.compare(contrasena, user.contrasena);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    // Generar token
    const token = jwt.sign(
      {
        id_medico: user.id_medico,
        usuario: user.usuario,
        id_consultorio: user.id_consultorio
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id_medico: user.id_medico,
          usuario: user.usuario,
          id_consultorio: user.id_consultorio,
          numero_consultorio: user.numero_consultorio,
          policlinico: user.policlinico
        },
        token
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor',
      error: error.message
    });
  }
};

// Verificar token y obtener datos del usuario
const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.id_medico, m.usuario, m.id_consultorio, 
                    c.numero as numero_consultorio, p.nombre as policlinico
             FROM MEDICOS m
             JOIN CONSULTORIOS c ON m.id_consultorio = c.id_consultorio
             JOIN POLICLINICOS p ON c.id_policlinico = p.id_policlinico
             WHERE m.id_medico = $1`,
      [req.user.id_medico]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
};

module.exports = { register, login, getMe };