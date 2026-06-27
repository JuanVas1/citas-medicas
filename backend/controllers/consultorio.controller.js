const Consultorio = require('../models/Consultorio');

exports.getConsultorios = async (req, res, next) => {
  try {
    const consultorios = await Consultorio.find().sort({ createdAt: -1 });
    return res.status(200).json(consultorios);
  } catch (error) {
    next(error);
  }
};

exports.createConsultorio = async (req, res, next) => {
  try {
    const { numero, piso, especialidad, activo } = req.body;

    if (!numero || !piso || !especialidad) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const existente = await Consultorio.findOne({ numero: numero.trim() });
    if (existente) {
      return res.status(409).json({ error: `El consultorio ${numero} ya existe` });
    }

    const consultorio = await Consultorio.create({
      numero: numero.trim(),
      piso: piso.trim(),
      especialidad: especialidad.trim(),
      activo: activo !== undefined ? activo : true
    });

    return res.status(201).json(consultorio);
  } catch (error) {
    next(error);
  }
};

exports.updateConsultorio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { numero, piso, especialidad, activo } = req.body;

    const consultorio = await Consultorio.findByIdAndUpdate(
      id,
      {
        ...(numero ? { numero: numero.trim() } : {}),
        ...(piso ? { piso: piso.trim() } : {}),
        ...(especialidad ? { especialidad: especialidad.trim() } : {}),
        ...(activo !== undefined ? { activo } : {})
      },
      { new: true, runValidators: true }
    );

    if (!consultorio) {
      return res.status(404).json({ error: 'Consultorio no encontrado' });
    }

    return res.status(200).json(consultorio);
  } catch (error) {
    next(error);
  }
};

exports.deleteConsultorio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const consultorio = await Consultorio.findByIdAndDelete(id);

    if (!consultorio) {
      return res.status(404).json({ error: 'Consultorio no encontrado' });
    }

    return res.status(200).json({ message: 'Consultorio eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

exports.toggleConsultorio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const consultorio = await Consultorio.findById(id);

    if (!consultorio) {
      return res.status(404).json({ error: 'Consultorio no encontrado' });
    }

    consultorio.activo = !consultorio.activo;
    await consultorio.save();

    return res.status(200).json(consultorio);
  } catch (error) {
    next(error);
  }
};
