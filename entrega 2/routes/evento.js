const express = require('express');
const Evento = require("../models/evento");
const router = express.Router();

router.post("/votaciones_admin", async (req,res) => {
    
    const{ nombre_evento1, candidato_1a, candidato_2a, candidato_3a, fecha} = req.body;

    try{
        const newEvento = new Evento({
            nombre: nombre_evento1,
            candidato1: candidato_1a,
            candidato2: candidato_2a,
            candidato3: candidato_3a,
            fecha: fecha,
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
