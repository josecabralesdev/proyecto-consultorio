/**
 * Script para configurar la base de datos en Supabase
 * Ejecutar: node scripts/setupSupabase.js
 */

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Detectar Supabase
const isSupabase = process.env.DB_HOST?.includes('supabase') ||
  process.env.DB_HOST?.includes('pooler');

const poolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 5432,
  connectionTimeoutMillis: 30000, // 30 segundos de timeout
};

if (isSupabase) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

const setupDatabase = async () => {
  console.log('🔄 Intentando conectar a la base de datos...');
  console.log(`   Host: ${process.env.DB_HOST}`);
  console.log(`   Puerto: ${process.env.DB_PORT}`);
  console.log(`   Usuario: ${process.env.DB_USER}`);
  console.log('');

  let client;

  try {
    client = await pool.connect();
    console.log('✅ Conexión establecida!\n');
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n💡 Sugerencias:');
    console.log('   1. Verifica que el proyecto de Supabase esté activo (no pausado)');
    console.log('   2. Ve a https://app.supabase.com y revisa el estado del proyecto');
    console.log('   3. Si está pausado, haz clic en "Restore project"');
    console.log('   4. Verifica que las credenciales sean correctas');
    console.log('   5. Intenta usar el Session Pooler (puerto 6543)');
    process.exit(1);
  }

  try {
    console.log('🚀 Iniciando configuración de la base de datos...\n');

    // Crear tablas
    console.log('📦 Creando tablas...');

    await client.query(`
            -- Tabla de Provincias
            CREATE TABLE IF NOT EXISTS PROVINCIAS (
                id_provincia SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL UNIQUE
            );

            -- Tabla de Municipios
            CREATE TABLE IF NOT EXISTS MUNICIPIOS (
                id_municipio SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                id_provincia INTEGER NOT NULL REFERENCES PROVINCIAS(id_provincia) ON DELETE CASCADE
            );

            -- Tabla de Policlinicos
            CREATE TABLE IF NOT EXISTS POLICLINICOS (
                id_policlinico SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                id_municipio INTEGER NOT NULL REFERENCES MUNICIPIOS(id_municipio) ON DELETE CASCADE
            );

            -- Tabla de Consultorios
            CREATE TABLE IF NOT EXISTS CONSULTORIOS (
                id_consultorio SERIAL PRIMARY KEY,
                numero VARCHAR(50) NOT NULL,
                id_policlinico INTEGER NOT NULL REFERENCES POLICLINICOS(id_policlinico) ON DELETE CASCADE
            );

            -- Tabla para los Médicos
            CREATE TABLE IF NOT EXISTS MEDICOS (
                id_medico SERIAL PRIMARY KEY,
                usuario VARCHAR(50) NOT NULL UNIQUE,
                contrasena VARCHAR(255) NOT NULL,
                id_consultorio INTEGER NOT NULL REFERENCES CONSULTORIOS(id_consultorio) ON DELETE CASCADE,
                creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            -- Tabla de Administradores
            CREATE TABLE IF NOT EXISTS ADMINISTRADORES (
                id_admin SERIAL PRIMARY KEY,
                usuario VARCHAR(50) NOT NULL UNIQUE,
                contrasena VARCHAR(255) NOT NULL,
                nombre VARCHAR(100) NOT NULL,
                creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            -- Tabla de Niveles Escolares
            CREATE TABLE IF NOT EXISTS NIVELES_ESCOLARES (
                id_nivel SERIAL PRIMARY KEY,
                descripcion VARCHAR(100) NOT NULL UNIQUE
            );

            -- Tabla de Ocupaciones
            CREATE TABLE IF NOT EXISTS OCUPACIONES (
                id_ocupacion SERIAL PRIMARY KEY,
                descripcion VARCHAR(100) NOT NULL UNIQUE
            );

            -- Tabla de Grupos Dispensariales
            CREATE TABLE IF NOT EXISTS GRUPOS_DISPENSARIALES (
                id_grupo SERIAL PRIMARY KEY,
                descripcion VARCHAR(100) NOT NULL UNIQUE
            );

            -- Tabla de Sexos
            CREATE TABLE IF NOT EXISTS SEXOS (
                id_sexo SERIAL PRIMARY KEY,
                codigo CHAR(1) NOT NULL UNIQUE,
                descripcion VARCHAR(20) NOT NULL
            );

            -- Tabla de Colores de Piel
            CREATE TABLE IF NOT EXISTS COLORES_PIEL (
                id_color SERIAL PRIMARY KEY,
                codigo CHAR(1) NOT NULL UNIQUE,
                descripcion VARCHAR(50) NOT NULL
            );

            -- Tabla de Áreas Geográficas
            CREATE TABLE IF NOT EXISTS AREAS_GEOGRAFICAS (
                id_area SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                id_consultorio INTEGER NOT NULL REFERENCES CONSULTORIOS(id_consultorio) ON DELETE CASCADE
            );

            -- Tabla de Pacientes
            CREATE TABLE IF NOT EXISTS PACIENTES (
                id_paciente SERIAL PRIMARY KEY,
                numero_historia_clinica INTEGER NOT NULL,
                nombre_apellidos VARCHAR(255) NOT NULL,
                carnet_identidad VARCHAR(20) UNIQUE,
                id_sexo INTEGER REFERENCES SEXOS(id_sexo) ON DELETE SET NULL,
                direccion VARCHAR(255),
                id_area_geografica INTEGER REFERENCES AREAS_GEOGRAFICAS(id_area),
                id_nivel_escolar INTEGER REFERENCES NIVELES_ESCOLARES(id_nivel),
                id_ocupacion INTEGER REFERENCES OCUPACIONES(id_ocupacion),
                id_grupo_dispensarial INTEGER REFERENCES GRUPOS_DISPENSARIALES(id_grupo),
                id_color_piel INTEGER REFERENCES COLORES_PIEL(id_color),
                problemas_salud TEXT,
                observaciones TEXT,
                id_consultorio INTEGER NOT NULL REFERENCES CONSULTORIOS(id_consultorio) ON DELETE CASCADE
            );
        `);
    console.log('✅ Tablas creadas\n');

    // Insertar datos iniciales
    console.log('📝 Insertando datos iniciales...');

    // Provincia
    await client.query(`
            INSERT INTO PROVINCIAS (nombre) VALUES ('Ciego de Avila')
            ON CONFLICT (nombre) DO NOTHING
        `);

    // Obtener id de provincia
    const provResult = await client.query(`SELECT id_provincia FROM PROVINCIAS WHERE nombre = 'Ciego de Avila'`);
    const idProvincia = provResult.rows[0]?.id_provincia;

    if (idProvincia) {
      // Municipio
      await client.query(`
                INSERT INTO MUNICIPIOS (nombre, id_provincia) 
                VALUES ('Ciego de Avila', $1)
                ON CONFLICT DO NOTHING
            `, [idProvincia]);

      // Obtener id de municipio
      const munResult = await client.query(`SELECT id_municipio FROM MUNICIPIOS WHERE nombre = 'Ciego de Avila'`);
      const idMunicipio = munResult.rows[0]?.id_municipio;

      if (idMunicipio) {
        // Policlínicos
        const policlinicos = ['Norte', 'Sur', 'Centro', 'Belkis Sotomayor', 'Ceballos'];
        for (const nombre of policlinicos) {
          await client.query(`
                        INSERT INTO POLICLINICOS (nombre, id_municipio)
                        VALUES ($1, $2)
                        ON CONFLICT DO NOTHING
                    `, [nombre, idMunicipio]);
        }

        // Consultorios
        const policlinicoRows = await client.query('SELECT id_policlinico FROM POLICLINICOS');
        for (const row of policlinicoRows.rows) {
          for (let i = 1; i <= 3; i++) {
            await client.query(`
                            INSERT INTO CONSULTORIOS (numero, id_policlinico)
                            SELECT $1, $2
                            WHERE NOT EXISTS (
                                SELECT 1 FROM CONSULTORIOS 
                                WHERE numero = $1 AND id_policlinico = $2
                            )
                        `, [i.toString(), row.id_policlinico]);
          }
        }
      }
    }

    // Niveles Escolares
    const niveles = ['Primario', 'Secundario', 'Universitario', 'Postgrado'];
    for (const nivel of niveles) {
      await client.query(`
                INSERT INTO NIVELES_ESCOLARES (descripcion) VALUES ($1)
                ON CONFLICT (descripcion) DO NOTHING
            `, [nivel]);
    }

    // Ocupaciones
    const ocupaciones = ['Estudiante', 'Maestro', 'Ingeniero', 'Médico', 'Jubilado'];
    for (const ocupacion of ocupaciones) {
      await client.query(`
                INSERT INTO OCUPACIONES (descripcion) VALUES ($1)
                ON CONFLICT (descripcion) DO NOTHING
            `, [ocupacion]);
    }

    // Grupos Dispensariales
    const grupos = ['I', 'II', 'III', 'IV'];
    for (const grupo of grupos) {
      await client.query(`
                INSERT INTO GRUPOS_DISPENSARIALES (descripcion) VALUES ($1)
                ON CONFLICT (descripcion) DO NOTHING
            `, [grupo]);
    }

    // Sexos
    const sexos = [['M', 'Masculino'], ['F', 'Femenino'], ['N', 'No especificado']];
    for (const [codigo, descripcion] of sexos) {
      await client.query(`
                INSERT INTO SEXOS (codigo, descripcion) VALUES ($1, $2)
                ON CONFLICT (codigo) DO NOTHING
            `, [codigo, descripcion]);
    }

    // Colores de Piel
    const colores = [['B', 'Blanco'], ['M', 'Mestizo'], ['N', 'Negro']];
    for (const [codigo, descripcion] of colores) {
      await client.query(`
                INSERT INTO COLORES_PIEL (codigo, descripcion) VALUES ($1, $2)
                ON CONFLICT (codigo) DO NOTHING
            `, [codigo, descripcion]);
    }

    console.log('✅ Datos iniciales insertados\n');

    // Crear administrador
    console.log('👤 Creando usuario administrador...');

    const adminExists = await client.query(
      'SELECT * FROM ADMINISTRADORES WHERE usuario = $1',
      ['admin']
    );

    if (adminExists.rows.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      await client.query(`
                INSERT INTO ADMINISTRADORES (usuario, contrasena, nombre)
                VALUES ($1, $2, $3)
            `, ['admin', hashedPassword, 'Administrador Principal']);

      console.log('✅ Administrador creado');
      console.log('   Usuario: admin');
      console.log('   Contraseña: admin123\n');
    } else {
      console.log('ℹ️  El administrador ya existe\n');
    }

    console.log('🎉 ¡Configuración completada exitosamente!\n');

    // Resumen
    const counts = await client.query(`
            SELECT 
                (SELECT COUNT(*) FROM PROVINCIAS) as provincias,
                (SELECT COUNT(*) FROM MUNICIPIOS) as municipios,
                (SELECT COUNT(*) FROM POLICLINICOS) as policlinicos,
                (SELECT COUNT(*) FROM CONSULTORIOS) as consultorios,
                (SELECT COUNT(*) FROM SEXOS) as sexos,
                (SELECT COUNT(*) FROM COLORES_PIEL) as colores_piel
        `);

    console.log('📋 Resumen de datos:');
    console.log(`   • Provincias: ${counts.rows[0].provincias}`);
    console.log(`   • Municipios: ${counts.rows[0].municipios}`);
    console.log(`   • Policlínicos: ${counts.rows[0].policlinicos}`);
    console.log(`   • Consultorios: ${counts.rows[0].consultorios}`);
    console.log(`   • Sexos: ${counts.rows[0].sexos}`);
    console.log(`   • Colores de piel: ${counts.rows[0].colores_piel}`);

  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message);
    if (error.detail) {
      console.error('   Detalle:', error.detail);
    }
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
};

setupDatabase().catch((err) => {
  console.error('\n❌ Error fatal:', err.message);
  process.exit(1);
});