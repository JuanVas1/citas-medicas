const Doctor = require('../models/Doctor');

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ active: true }).sort('speciality');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor no encontrado' });
    }

    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createDoctor = async (req, res) => {
  try {
    const { name, speciality, phone, email, licenseNumber } = req.body;

    if (!name || !speciality || !phone || !email || !licenseNumber) {
      return res.status(400).json({ error: 'Por favor completa todos los campos' });
    }

    const doctor = new Doctor({
      name,
      speciality,
      phone,
      email,
      licenseNumber
    });

    await doctor.save();

    res.status(201).json({
      success: true,
      doctor
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    let doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor no encontrado' });
    }

    doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      doctor
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor no encontrado' });
    }

    // Desactivar en lugar de eliminar
    doctor.active = false;
    await doctor.save();

    res.json({
      success: true,
      message: 'Doctor desactivado exitosamente'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
