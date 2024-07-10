const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require("../config/authConfig");
const db = require("../models");
const Role = db.role;

exports.register = async (req, res) => {
  const { nombre, correo, password } = req.body; // Cambia 'rut' por 'correo'

  try {
    let user = await User.findOne({ correo }); // Cambia 'rut' por 'correo'

    if (user) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    user = new User({
      name: nombre,
      correo: correo, // Cambia 'rut' por 'correo'
      password: password,
      //password: bcrypt.hashSync(password, 8),
    });

    // Si el correo es 'admin@example.com', asignar el rol de 'admin'
    if (correo === 'admin@example.com') { // Cambia 'rut' por 'correo'
      Role.findOne({name: "admin"}, (err, role) => {
        if(err){
            res.status(500).send({message: err});
            return;
        }
        user.roles = [role._id];
        user.save(err => {
            if(err){
                res.status(500).send({message: err});
                return;
            }

            res.send({message: "User was registered successfully!"});
        });
      });
    } else {
      Role.findOne({name: "user"}, (err, role) => {
        if(err){
            res.status(500).send({message: err});
            return;
        }
        user.roles = [role._id];
        user.save(err => {
            if(err){
                res.status(500).send({message: err});
                return;
            }

            res.send({message: "User was registered successfully!"});
        });
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.login = async (req, res) => {
  console.log("Controlador de inicio de sesión llamado");
  try {
    // Obtener los datos del formulario
    const { correo, password } = req.body; // Cambia 'rut' por 'correo'

    // Buscar el usuario por el correo
    const user = await User.findOne({ correo }); // Cambia 'rut' por 'correo'
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    // Comparar la contraseña con la almacenada en la base de datos
    const validPassword = bcrypt.compareSync(
      password, // contraseña proporcionada por el usuario
      user.password // contraseña encriptada almacenada en la base de datos
    );

    if (!validPassword) {
      return res.status(401).send({
        accessToken: null,
        message: "Contraseña inválida."
      });
    }

    // Crear el token JWT con los datos del usuario y una clave secreta
    var token = jwt.sign(
      { id: user.id, correo: user.correo }, // Cambia 'rut' por 'correo'
      config.secret,
      { algorithm: 'HS256', expiresIn: "1h" }
    );

    var authorities = [];
    for (let i = 0; i <user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
    }
    res.status(200).send({
        id: user._id,
        user: user.correo, // Cambia 'rut' por 'correo'
        roles: authorities,
        accessToken: token
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};
