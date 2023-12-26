const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/user');
const config = require("../config/authConfig");
const db = require("../models");
const Role = db.role;

exports.signup = async (req, res) => {
  try {
    // Obtener los datos del formulario
    const { nombre_completo, correo, contrasena } = req.body;

    if (!nombre_completo || !correo || !contrasena) {
      return res.status(400).send({ message: "Todos los campos son obligatorios" });
    }

    // Validar que el RUT sea único
    const user = await User.findOne({ correo });
    if (user) {
      return res.status(400).send({ message: "El correo ya está registrado" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 8);

    // Crear el nuevo usuario
    const newUser = new User({
      name: nombre_completo,
      correo: correo,
      password: hashedPassword,
    });

    // Si el correo es admin@email.com, asignar el rol de 'admin'
    if (correo === 'admin@email.com') {
      Role.findOne({name: "admin"}, (err, role) => {
        if(err){
            res.status(500).send({message: err});
            return;
        }
        newUser.roles = [role._id];
        newUser.save(err => {
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
        newUser.roles = [role._id];
        newUser.save(err => {
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

exports.signin = async (req, res) => {
  console.log("Controlador de inicio de sesión llamado");
  try {
    // Obtener los datos del formulario
    const { correo, contrasena } = req.body;

    // Buscar el usuario por el correo
    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    // Comparar la contraseña con la almacenada en la base de datos
    const validPassword = await bcrypt.compare(contrasena, user.password);
    if (!validPassword) {
      return res.status(401).send({ message: "Contraseña incorrecta" });
    }

    // Crear el token JWT con los datos del usuario y una clave secreta
    var token = jwt.sign(
      { id: user._id, correo: user.correo },
      config.secret,
      { algorithm: 'HS256', expiresIn: "1h" }
    );

    req.session.token = token;

    // Registrar el token
    console.log("Token JWT creado:", token);

    var authorities = [];
    for (let i = 0; i <user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
    }
    res.status(200).send({
        id: user._id,
        correo: user.correo,
        roles: authorities,
        accessToken: token
    });
  } catch (error) {
    // Enviar un mensaje de error al usuario
    res.status(500).send({ message: error.message });
  }
};

verifyToken = ((req, res, next) => {
  let token = req.headers["x-acess-token"];

  if(!token) {
      return res.status(403).send({message: "No token provided!"});
  }
  jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
          return res.status(401).send({message: "Unauthorized!"});
      }
      req.userId = decoded.id;
      next();
  });
});

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
      if (err) {
          res.status(500).send({message: err});
          return;
      }

      Role.find(
          {
              _id: {$in: user.role}
          },
          (err, roles) => {
              if (err) {
                  res.status(500).send({message: err});                
                  return;
              }

              for(let i=0; i<roles.length; i++) {
                  if (roles[i].name === "admin") {
                      next();
                      return;
                  }
              }
              res.status(403).send({message: "Require Admin Role!"});
              return;
          }
      );
  });
};
const authJwt = {
  verifyToken,
  isAdmin
};
module.exports = authJwt;
