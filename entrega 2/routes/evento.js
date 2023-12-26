const express = require('express');
const Evento = require("../models/evento");
const router = express.Router();
const Candidato = require('../models/candidato');

router.post("/votaciones_admin", async (req,res) => {
    
    const{ nombre_evento1, candidato_1a, candidato_2a, candidato_3a, fecha} = req.body;

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

        res.redirect('/newEvento_exito');

    }
    catch (error){
        console.error(error);
       res.status(500).send('Hubo un error al crear el evento');
    }
});

module.exports = router;
