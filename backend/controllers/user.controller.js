const User = require('../models/User');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, lastName, dni, phone, age, email, address, policy } = req.body;
    const userId = req.user.id;

    // Campos permitidos para actualización
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (lastName !== undefined) updateFields.lastName = lastName;
    if (dni !== undefined) updateFields.dni = dni;
    if (phone !== undefined) updateFields.phone = phone;
    if (age !== undefined) updateFields.age = age;
    if (email !== undefined) updateFields.email = email;
    if (address !== undefined) updateFields.address = address;
    if (policy !== undefined) updateFields.policy = policy;

    // Si viene password, no lo actualizamos por esta ruta (por seguridad)
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        lastName: user.lastName,
        dni: user.dni,
        phone: user.phone,
        age: user.age,
        email: user.email,
        address: user.address,
        policy: user.policy,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
