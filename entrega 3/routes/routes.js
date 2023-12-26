const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');

// Ejemplo de una ruta protegida que requiere autenticación
router.get('/ruta-protegida', authenticate, (req, res) => {
  // En este punto, req.user contiene la información del usuario autenticado
  res.send('Esta es una ruta protegida');
});

module.exports = router;
