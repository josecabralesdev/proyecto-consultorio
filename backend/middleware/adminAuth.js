const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de acceso requerido'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    // Verificar que sea un admin
    if (!decoded.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requieren permisos de administrador'
      });
    }

    req.admin = decoded;
    next();
  });
};

module.exports = authenticateAdmin;