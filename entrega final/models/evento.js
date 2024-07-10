const mongoose = require('mongoose');

const Evento  = mongoose.model(
    "Evento",
    new mongoose.Schema({
    nombre: String,
    candidato1: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidato' },
    candidato2: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidato' },
    candidato3: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidato' },
    fecha: Date,
    estado: Boolean
    })
);

module.exports = Evento;
