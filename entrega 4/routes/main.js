const express = require('express');
const Evento = require("../models/evento");
const { authJwt, verifySignUp, } = require('../middlewares');

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

router.get('/eventos/crear', authJwt.verifyToken, authJwt.isAdmin, (req,res) => {
  res.render('layouts/votaciones_admin', {layout: false});
});

router.get('/opciones_admin', authJwt.verifyToken, authJwt.isAdmin, (req, res) => {
  res.render('layouts/opciones_admin', { layout: false });
});

router.get('/eventos/actualizarEstado', authJwt.verifyToken, authJwt.isAdmin, async (req, res) => {
  const eventos = await Evento.find();
  console.log(eventos);
  const eventosParaPlantilla = eventos.map(evento => evento.toObject());
  res.render('layouts/actualizar_estado', { encuestas: eventosParaPlantilla , layout: false });
});

module.exports = router;