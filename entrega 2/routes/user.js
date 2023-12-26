const express = require('express');
const User = require('../models/user.js');
const Role = require('../models/role');
const { authJwt, verifySignUp } = require('../middlewares');
const controller = require("../controllers/userController");
const auth = require('../controllers/authController.js');
const router = express.Router();
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
    '/votaciones_admin',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};

router.get('/registro', (req, res) => {
  res.render('layouts/registro', { layout: false });
});

// Ruta para manejar la presentación del formulario de registro
router.post(
  '/registro',
  [
    verifySignUp.checkDuplicateUsernameOrRut
  ],
  async (req, res) => {
    const { nombre_completo, rut, contrasena } = req.body;
  
    try {
      // Crear el nuevo usuario
      const newUser = new User({
        name: nombre_completo,
        rut: rut,
        password: contrasena,
      });
      const adminRole = await Role.findOne({ name: 'admin' });
      if (nombre_completo === 'admin' && rut === "123456789") {
        newUser.role = adminRole.name;
      }
      await newUser.save();
      

      res.redirect('/registrado_con_exito');
    } catch (error) {
      console.error(error);
      res.status(500).send('Hubo un error al crear el usuario');
    }
  }
);

router.get('/ingreso1', (req, res) => {
  res.render('layouts/ingreso1', { layout: false });
});

// Nueva ruta POST para manejar la solicitud de inicio de sesión
router.post('/ingreso1', async (req, res) => {
  const { rut, password } = req.body;

  try {
    // Buscar al usuario por su RUT
    const user = await User.findOne({ rut: rut });

    if (!user) {
      return res.status(400).send('El RUT ingresado no está registrado');
    }

    // Verificar la contraseña
    if (!bcrypt.compareSync(
      req.body.contrasena, // contraseña proporcionada por el usuario
      user.password // contraseña encriptada almacenada en la base de datos
    )) {
      return res.status(400).send('La contraseña ingresada es incorrecta');
    }

    // Iniciar sesión del usuario
    req.session.userId = user._id;
    req.session.userRut = user.rut;
    req.session.userRole = user.role;

    res.redirect('/ingresado_con_exito');
  } catch (error) {
    console.error(error);
    res.status(500).send('Hubo un error al iniciar sesión');
  }
});

module.exports = router;