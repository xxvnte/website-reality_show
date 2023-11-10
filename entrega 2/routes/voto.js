const express = require('express');
const Evento = require('../models/evento');
const Voto = require('../models/voto');
const mongoose = require('mongoose');
const router = express.Router();
const db = mongoose.connection;
// Ruta para manejar la votación
router.post('/votar', async (req, res) => {
    const { eventoId, opcion_voto } = req.body;
  
    try {
      // Guardar el voto en la base de datos
      const voto = new Voto({
        evento: eventoId,
        candidato: opcion_voto // Aquí estás guardando el nombre del candidato
      });
  
      await voto.save();
  
      res.redirect('/votaciones');
    } catch (error) {
      console.error(error);
      res.status(500).send('Hubo un error al registrar el voto.');
    }
  });

// Ruta para mostrar las votaciones
router.get('/votaciones', async (req, res) => {
  try {
    const encuestas = await Evento.find().lean();
    const conteoVotosArray = await db.collection('votos').aggregate([
      {
        $group: {
          _id: "$candidato",
          conteo: { $sum: 1 }
        }
      }
    ]).toArray();    

    // Convertir conteoVotosArray en un objeto
    const conteoVotos = {};
    conteoVotosArray.forEach(voto => {
      conteoVotos[voto._id] = voto.conteo;
    });

    console.log(conteoVotos); // Imprimir conteoVotos en la consola del servidor

    res.render('layouts/votaciones', { encuestas, conteoVotos, layout: false });
  } catch (error) {
    console.error('Hubo un error al obtener las votaciones:', error);
    res.status(500).send('Error al obtener las votaciones');
  }
});

module.exports = router;
