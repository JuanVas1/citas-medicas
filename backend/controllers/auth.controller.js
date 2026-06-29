const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '8h'
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role = 'paciente' } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: 'Nombre, email, telefono y contrasena son obligatorios' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ error: 'El email ya esta registrado' });
    }

    const user = await User.create({ name, email, password, phone, role });
    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contrasena son obligatorios' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Email o contrasena incorrectos' });
    }

    const token = createToken(user);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res) => {
  return res.status(200).json({ user: req.user });
};