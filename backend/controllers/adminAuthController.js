const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Login de administrador
const loginAdmin = async (req, res) => {
  const { usuario, contrasena } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM ADMINISTRADORES WHERE usuario = $1',
      [usuario]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    const admin = result.rows[0];

    const validPassword = await bcrypt.compare(contrasena, admin.contrasena);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    const token = jwt.sign(
      {
        id_admin: admin.id_admin,
        usuario: admin.usuario,
        nombre: admin.nombre,
        isAdmin: true
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        admin: {
          id_admin: admin.id_admin,
          usuario: admin.usuario,
          nombre: admin.nombre
        },
        token
      }
    });

  } catch (error) {
    console.error('Error en login admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor',
      error: error.message
    });
  }
};

// Registrar nuevo administrador (solo otros admins pueden hacerlo)
const registerAdmin = async (req, res) => {
  const { usuario, contrasena, nombre } = req.body;

  try {
    const userExists = await pool.query(
      'SELECT * FROM ADMINISTRADORES WHERE usuario = $1',
      [usuario]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de usuario ya está en uso'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    const newAdmin = await pool.query(
      `INSERT INTO ADMINISTRADORES (usuario, contrasena, nombre) 
             VALUES ($1, $2, $3) 
             RETURNING id_admin, usuario, nombre, creado_en`,
      [usuario, hashedPassword, nombre]
    );

    res.status(201).json({
      success: true,
      message: 'Administrador registrado exitosamente',
      data: newAdmin.rows[0]
    });

  } catch (error) {
    console.error('Error en registro admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor',
      error: error.message
    });
  }
};

// Obtener datos del admin actual
const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id_admin, usuario, nombre, creado_en FROM ADMINISTRADORES WHERE id_admin = $1',
      [req.admin.id_admin]
    );

    res.json({
      success: true,
      data: { ...result.rows[0], isAdmin: true }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
};

module.exports = { loginAdmin, registerAdmin, getMe };