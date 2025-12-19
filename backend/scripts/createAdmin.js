const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const createAdmin = async () => {
  const usuario = 'admin';
  const contrasena = 'admin123';
  const nombre = 'Administrador Principal';

  try {
    // Verificar si ya existe
    const exists = await pool.query(
      'SELECT * FROM ADMINISTRADORES WHERE usuario = $1',
      [usuario]
    );

    if (exists.rows.length > 0) {
      console.log('❌ El administrador ya existe');
      process.exit(0);
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    // Insertar admin
    const result = await pool.query(
      `INSERT INTO ADMINISTRADORES (usuario, contrasena, nombre) 
             VALUES ($1, $2, $3) 
             RETURNING id_admin, usuario, nombre`,
      [usuario, hashedPassword, nombre]
    );

    console.log('✅ Administrador creado exitosamente:');
    console.log('   Usuario:', usuario);
    console.log('   Contraseña:', contrasena);
    console.log('   Nombre:', nombre);
    console.log('');
    console.log('🔐 Accede en: http://localhost:5173/admin/login');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();