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
    const { name, email, password, phone, specialty, office, licenseNumber, consultorioId } = req.body;

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
      licenseNumber: licenseNumber || '',
      consultorioId: consultorioId || null
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

// Crear perfil médico para un usuario existente con rol 'doctor' que aún no tiene perfil
exports.createFromUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { specialty, office, licenseNumber } = req.body;

    if (!specialty || !office) {
      return res.status(400).json({ error: 'Especialidad y consultorio son obligatorios' });
    }

    // Verificar que el usuario existe y tiene rol doctor
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (user.role !== 'doctor') {
      return res.status(400).json({ error: 'El usuario no tiene rol de doctor' });
    }

    // Verificar que no tenga ya un perfil
    const existing = await Doctor.findOne({ userId });
    if (existing) {
      return res.status(409).json({ error: 'Este usuario ya tiene un perfil médico' });
    }

    const doctor = await Doctor.create({
      userId,
      specialty,
      office,
      licenseNumber: licenseNumber || ''
    });

    await doctor.populate('userId', 'name email phone');
    return res.status(201).json({ doctor });
  } catch (error) {
    next(error);
  }
};

// Actualizar perfil médico existente
exports.updateDoctorProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { specialty, office, licenseNumber } = req.body;

    // Construir solo los campos que vienen definidos
    const updateFields = {};
    if (specialty !== undefined) updateFields.specialty = specialty;
    if (office !== undefined) updateFields.office = office;
    if (licenseNumber !== undefined) updateFields.licenseNumber = licenseNumber;

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: false }  // runValidators:false evita conflictos con campos required
    ).populate('userId', 'name email phone');

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor no encontrado. Verifica que el perfil existe.' });
    }

    return res.status(200).json({ doctor });
  } catch (error) {
    console.error('[updateDoctorProfile] error:', error.message);
    next(error);
  }
};