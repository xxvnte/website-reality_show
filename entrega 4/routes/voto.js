const express = require('express');
const Evento = require('../models/evento');
const Voto = require('../models/voto');
const mongoose = require('mongoose');
const router = express.Router();
const db = mongoose.connection;
const Candidato = require('../models/candidato');
const { authJwt, verifySignUp } = require('../middlewares');
const cookieSession = require('cookie-session');

// Ruta para manejar la votación
router.post('/eventos/:id/votar',authJwt.verifyToken, async (req, res) => {

  if (!req.session.token) {
    console.error('Error: El usuario no ha iniciado sesión');
    return res.send('<script>alert("Debes iniciar sesión para votar"); window.location.href = "/ingreso1";</script>');
  }

  const { opcion_voto } = req.body;
  const eventoId = req.params.id;

  // Valida el ID del candidato
  if (!mongoose.Types.ObjectId.isValid(opcion_voto)) {
    return res.status(400).json({ success: false, message: 'Invalid candidate ID' });
  }

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

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// Ruta para obtener la lista de todos los eventos
router.get('/eventos', authJwt.verifyToken, async (req, res) => {
  if (!req.session.token) {
    console.error('Error: El usuario no ha iniciado sesión');
    return res.send('<script>alert("Debes iniciar sesión para ver los eventos"); window.location.href = "/ingreso1";</script>');
  }
  try {
    const eventos = await Evento.find().lean();
    res.json(eventos.map(evento => ({ titulo: evento.nombre, id: evento._id })));
  } catch (error) {
    console.error('Hubo un error al obtener los eventos:', error);
    res.status(500).send('Error al obtener los eventos');
  }
});

// Ruta para obtener los detalles de un evento específico
router.get('/eventos/:id', authJwt.verifyToken, authJwt.isAdmin, async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id).populate('candidato1 candidato2 candidato3').lean();
    const conteoVotosArray = await db.collection('votos').aggregate([
      {
        $match: { evento: mongoose.Types.ObjectId(req.params.id) }
      },
      {
        $lookup: {
          from: "candidatos",
          localField: "candidato",
          foreignField: "_id",
          as: "candidatoData"
        }
      },
      {
        $group: {
          _id: "$candidatoData.nombre",
          conteo: { $sum: 1 }
        }
      }
    ]).toArray();    

    // Convertir conteoVotosArray en un objeto
    const conteoVotos = {};
    conteoVotosArray.forEach(voto => {
      conteoVotos[voto._id] = voto.conteo;
    });

    res.json({ evento, conteoVotos });
  } catch (error) {
    console.error('Hubo un error al obtener el evento:', error);
    res.status(500).send('Error al obtener el evento');
  }
});

module.exports = router;
