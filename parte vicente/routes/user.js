const express = require('express');
const router = express.Router();

router.get('/registro', (req, res) => {
  res.render('registro');
});

router.get('/ingreso1', (req, res) => {
  res.render('ingreso1');
});

router.get('/votar_evento', (req, res) => {
  res.render('votar_evento');
});

module.exports = router;
