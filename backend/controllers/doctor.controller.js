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
    next(error);
  }
};