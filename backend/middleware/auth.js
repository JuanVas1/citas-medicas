const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta_aqui');
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tienes permisos para acceder a este recurso' });
    }
    next();
  };
};
