const express = require('express');
const User = require('../models/user.js');
const Role = require('../models/role');
const { authJwt, verifySignUp } = require('../middlewares');
const controller = require("../controllers/userController");
const auth = require('../controllers/authController.js');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const app = express();

const session = require('express-session');

app.use(session({
  secret: process.env.JWT_SECRET  ,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true } 
}));


module.exports = function(app) {
  app.use(function(req, res, next) {
      res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
      );
      next();
  });
  app.get(
    '/eventos/crear',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};

router.get('/registro', (req, res) => {
  res.render('layouts/registro', { layout: false });
});

// Ruta para manejar la presentación del formulario de registro
router.post(
  '/usuarios/crear',
  [
    verifySignUp.checkDuplicateUsernameOrEmail // Asegúrate de que esta función verifica los correos electrónicos duplicados
  ],
  async (req, res) => {
    const { nombre_completo, correo, contrasena } = req.body;
  
    try {
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ correo: correo });
      if (existingUser) {
        return res.json({ success: false });
      }

      // Crear el nuevo usuario
      const newUser = new User({
        name: nombre_completo,
        correo: correo,
        password: contrasena,
      });
      const adminRole = await Role.findOne({ name: 'admin' });
      if (nombre_completo === 'admin' && correo === "admin@email.com") {
        newUser.role = adminRole.name;
      }
      await newUser.save();

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Hubo un error al crear el usuario' });
    }
  }
);

router.get('/ingreso1', (req, res) => {
  res.render('layouts/ingreso1', { layout: false });
});

router.post('/usuarios/ingresar', async (req, res) => {
  const { correo, contrasena } = req.body; // Cambiamos 'rut' por 'correo'

  try {
    // Buscar al usuario por su correo
    const user = await User.findOne({ correo: correo }); // Cambiamos 'rut' por 'correo'

    if (!user) {
      return res.json({ success: false, message: 'El correo ingresado no está registrado' }); // Cambiamos 'RUT' por 'correo'
    }

    // Verificar la contraseña
    if (!bcrypt.compareSync(
      contrasena, // contraseña proporcionada por el usuario
      user.password // contraseña encriptada almacenada en la base de datos
    )) {
      return res.json({ success: false, message: 'La contraseña ingresada es incorrecta' });
    }

    // Iniciar sesión del usuario
    req.session.userId = user._id;
    req.session.userCorreo = user.correo; // Cambiamos 'userRut' por 'userCorreo'
    req.session.userRole = user.role;

    // Crear el token JWT con los datos del usuario y una clave secreta
    var token = jwt.sign({id: user._id, correo: user.correo},process.env.JWT_SECRET,{algorithm: 'HS256', expiresIn: '1h'});

    req.session.token = token;

    // Registrar el token
    console.log("Token JWT creado:", token);

    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

    res.json({ success: true, message: 'Ingresado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Hubo un error al iniciar sesión' });
  }
});

router.get('/usuarios/corriente', authJwt.verifyToken, async (req, res) => {
  try {
    // El middleware verifyToken ha verificado el token y ha añadido el userId a req
    const usuario = await User.findById(req.session.userId);

    if (!usuario) {
      return res.json({ autenticado: false });
    }

    authJwt.verifyToken

    // Devolver la información del usuario
    res.json({
      autenticado: true,
      nombre: usuario.name
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

module.exports = router;