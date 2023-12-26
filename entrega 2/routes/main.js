const express = require('express');
const User = require('../models/user');
const authJwt = require('../middlewares/authJwt');
const controller = require("../controllers/userController");
const Evento = require("../models/evento");

const router = express.Router();

router.get('/', function (req, res) {
  res.render('layouts/index');
});

router.get('/index', (req, res) => {
  res.render('layouts/index');
});
  
router.get("/ingresado_con_exito", (req, res) => {
    res.render('layouts/ingresado_con_exito', { layout: false });
  });
  
router.get("/registrado_con_exito", (req, res) => {
    res.render('layouts/registrado_con_exito', { layout: false });
  });

router.get("/newEvento_exito", (req, res) =>{
  res.render("layouts/newEvento_exito", {layout: false });
}); 

router.get("/votar_evento", async (req, res) => {
  try {
    // Renderiza la plantilla con los datos de los candidatos
    res.render('layouts/votar_evento', { candidatos, layout: false });
  } catch (error) {
    console.error('Hubo un error al obtener los candidatos:', error);
    res.status(500).send('Error al obtener los candidatos');
  }
});

router.get(
  '/votaciones_admin', (req,res) => {
    if (req.session.userRole === 'admin') {
      res.render('layouts/votaciones_admin', {layout: false});
    } else if (!req.session.userId) {
      return res.status(401).send('Debes iniciar sesión para acceder a esta página');
    } else if (req.session.userRole !== 'admin') {
      return res.status(403).send('No tienes permisos para acceder a esta página');
    }
  });

module.exports = router;