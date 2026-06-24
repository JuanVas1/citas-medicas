const Horario = require('../models/Horario');

exports.getAll = async (req, res, next) => {
  try {
    const horarios = await Horario.find()
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'name'
        }
      });

    return res.status(200).json(horarios);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { doctorId, day, startTime, endTime } = req.body;

    if (!doctorId || !day || !startTime || !endTime) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios'
      });
    }

    const horario = await Horario.create({
      doctorId,
      day,
      startTime,
      endTime
    });

    return res.status(201).json(horario);

  } catch (error) {
    next(error);
  }
};

exports.deleteHorario = async (req, res, next) => {
  try {

    await Horario.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: 'Horario eliminado'
    });

  } catch (error) {
    next(error);
  }
};