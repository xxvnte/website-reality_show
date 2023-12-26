const express = require('express');
const Evento = require("../models/evento");
const router = express.Router();
const Candidato = require('../models/candidato');
const { authJwt, verifySignUp, } = require('../middlewares');

router.post("/eventos/crear",authJwt.verifyToken, authJwt.isAdmin ,async (req,res) => {
    
  const { nombre_evento1, candidato_1a, candidato_2a, candidato_3a, fecha, estado } = req.body;

  try {
      // Crear los candidatos y obtener sus IDs
      const candidato1 = await new Candidato({ nombre: candidato_1a }).save();
      const candidato2 = await new Candidato({ nombre: candidato_2a }).save();
      const candidato3 = await new Candidato({ nombre: candidato_3a }).save();

      // Crear el evento con los IDs de los candidatos
      const newEvento = new Evento({
          nombre: nombre_evento1,
          candidato1: candidato1._id,
          candidato2: candidato2._id,
          candidato3: candidato3._id,
          fecha: fecha,
          estado: estado,
      });

      await newEvento.save();

      res.json({ success: true });

  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Hubo un error al crear el evento' });
  }
});


//ruta POST para actualizar el estado del evento
router.post('/eventos/actualizarEstado',authJwt.verifyToken, authJwt.isAdmin , async (req, res) => {
  console.log(req.body);
  const { estado, id } = req.body;
  
  if (!id) {
    return res.json({ success: false, message: 'No se proporcionó un id de evento.' });
  }
  
  try {
    const evento = await Evento.findByIdAndUpdate(id, { estado: estado }, { new: true });
    if (!evento) {
      return res.json({ success: false });
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

module.exports = router;

