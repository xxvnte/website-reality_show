const mongoose = require('mongoose');

const votoSchema = new mongoose.Schema({
  evento: { type: mongoose.Schema.Types.ObjectId, ref: 'Evento' },
  candidato: { type: String },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
});

const Voto = mongoose.model('Voto', votoSchema);

module.exports = Voto;
