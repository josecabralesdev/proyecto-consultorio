const { Pool } = require('pg');
require('dotenv').config();

// Detectar si estamos usando Supabase
const isSupabase = process.env.DB_HOST?.includes('supabase') ||
  process.env.DB_HOST?.includes('pooler');

// Configuración del pool
const poolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 5432,
  // Pool configuration
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

// Agregar SSL si es Supabase
if (isSupabase) {
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
}

const pool = new Pool(poolConfig);

// Verificar conexión
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conectado a PostgreSQL');
    console.log(`   📍 Host: ${process.env.DB_HOST}`);
    console.log(`   📦 Base de datos: ${process.env.DB_NAME}`);
    console.log(`   🔌 Puerto: ${process.env.DB_PORT}`);
    console.log(`   ☁️  Tipo: ${isSupabase ? 'Supabase Cloud' : 'Local'}`);
    client.release();
  } catch (err) {
    console.error('❌ Error conectando a PostgreSQL:', err.message);

    // Sugerencias de solución
    if (err.code === 'ETIMEDOUT') {
      console.log('\n💡 Posibles soluciones:');
      console.log('   1. Verifica que el proyecto de Supabase esté activo');
      console.log('   2. Verifica las credenciales en el archivo .env');
      console.log('   3. Usa el Session Pooler (puerto 6543)');
      console.log('   4. Revisa tu conexión a internet');
    }
  }
};

testConnection();

// Manejo de errores del pool
pool.on('error', (err) => {
  console.error('Error inesperado en el pool:', err.message);
});

module.exports = pool;