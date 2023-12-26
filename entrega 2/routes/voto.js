const express = require('express');
const Evento = require('../models/evento');
const Voto = require('../models/voto');
const mongoose = require('mongoose');
const router = express.Router();
const db = mongoose.connection;
const Candidato = require('../models/candidato');

// Ruta para manejar la votación
router.post('/votar', async (req, res) => {
  const { eventoId, opcion_voto } = req.body;

  // Convierte opcion_voto a un ObjectId
  const candidatoId = mongoose.Types.ObjectId(opcion_voto);

  try {
    // Buscar los nombres del evento y del candidato
    const evento = await Evento.findById(eventoId);
    const candidato = await Candidato.findById(candidatoId);

    // Guardar el voto en la base de datos
    const voto = new Voto({
      evento: eventoId,
      nombreEvento: evento.nombre,
      candidato: candidatoId,
      nombreCandidato: candidato.nombre
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
    let encuestas = await Evento.find().populate('candidato1 candidato2 candidato3').lean();

    // Obtén la cantidad de votos para cada candidato
    for (let encuesta of encuestas) {
      encuesta.votosCandidato1 = await Voto.countDocuments({ candidato: encuesta.candidato1._id });
      encuesta.votosCandidato2 = await Voto.countDocuments({ candidato: encuesta.candidato2._id });
      encuesta.votosCandidato3 = await Voto.countDocuments({ candidato: encuesta.candidato3._id });
    }

    res.render('layouts/votaciones', { encuestas, layout: false });
  } catch (error) {
    console.error('Hubo un error al obtener las votaciones:', error);
    res.status(500).send('Error al obtener las votaciones');
  }
});

module.exports = router;
