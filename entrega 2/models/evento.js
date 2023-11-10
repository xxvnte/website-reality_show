const mongoose = require('mongoose');

const Evento  = mongoose.model(
    "Evento",
    new mongoose.Schema({
    nombre: String,
    candidato1: String,
    candidato2: String,
    candidato3: String,
    fecha: Date
    })
);

module.exports = Evento;