const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const pacientesRoutes = require('./routes/pacientes');
const catalogosRoutes = require('./routes/catalogos');
const adminRoutes = require('./routes/admin');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/catalogos', catalogosRoutes);
app.use('/api/admin', adminRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
    ╔═══════════════════════════════════════════╗
    ║   🏥 Servidor de Consultorios Médicos     ║
    ║   📡 Puerto: ${PORT}                          ║
    ║   🚀 Estado: Activo                       ║
    ╚═══════════════════════════════════════════╝
    `);
});