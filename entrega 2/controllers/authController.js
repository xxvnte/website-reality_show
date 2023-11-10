const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require("../config/authConfig");
const db = require("../models");
const Role = db.role;

exports.register = async (req, res) => {
  const { nombre, rut, password } = req.body;

  try {
    let user = await User.findOne({ rut });

    if (user) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    user = new User({
      nombre,
      rut,
      password,
      //password: bcrypt.hashSync(password, 8),
    });

    if(req.body.roles) {
        Role.find(
            {
                name: {$in: req.body.roles}
            }, 
            (err, roles) => {
                if(err){
                    res.status(500).se({message: err});
                    return;
                }
                user.roles = roles.map( role => role._id);
                user.save(err => {
                    if(err){
                        res.status(500).send({message: err});
                        return;
                    }
                    res.send({message: "User was registered successfully!"});
                });
            }
        );

    }else{
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
    };
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

exports.login = async (req, res) => {
  const { rut, password } = req.body;

  try {
    let user = await User.findOne({ rut });

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    const passwordIsValid = bcrypt.compareSync(
      password, // contraseña proporcionada por el usuario
      user.password // contraseña encriptada almacenada en la base de datos
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Contraseña inválida."
      });
    }

    var token = jwt.sign({id: user.id, rut: user.rut}, config.secret, {
        algorithm: 'HS256',
        expiresIn: 3600  //1 hour
    });

    var authorities = [];
    for (let i = 0; i <user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
    }
    res.status(200).send({
        id: user._id,
        user: user.rut,
        roles: authorities,
        accessToken: token
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};
