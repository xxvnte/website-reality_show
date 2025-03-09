const mongoose = require('mongoose');

const CandidatoSchema = new mongoose.Schema({
  nombre: { type: String, required: true }
});

const Candidato = mongoose.model('Candidato', CandidatoSchema);

module.exports = Candidato;
