const Doctor = require('../models/Doctor');
const User = require('../models/User');

exports.getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({ active: true }).populate('userId', 'name email phone');
    return res.status(200).json(doctors);
  } catch (error) {
    next(error);
  }
};

exports.createDoctor = async (req, res, next) => {
  try {
    const { name, email, password, phone, specialty, office, licenseNumber } = req.body;

    if (!name || !email || !password || !phone || !specialty || !office) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Verificar si el correo ya existe antes de intentar crear
    const emailExistente = await User.findOne({ email: email.toLowerCase() });
    if (emailExistente) {
      return res.status(409).json({
        error: `El correo "${email}" ya está registrado en el sistema. Cada doctor debe tener un correo único.`
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'doctor'
    });

    const doctor = await Doctor.create({
      userId: user._id,
      specialty,
      office,
      licenseNumber: licenseNumber || ''
    });

    return res.status(201).json({ doctor });
  } catch (error) {
    // Por si acaso, también capturar el error E11000 de MongoDB directamente
    if (error.code === 11000) {
      const campo = Object.keys(error.keyValue || {})[0] || 'email';
      const valor = error.keyValue?.[campo] || '';
      return res.status(409).json({
        error: `El ${campo} "${valor}" ya está registrado. Cada doctor debe tener un correo único.`
      });
    }
    next(error);
  }
};