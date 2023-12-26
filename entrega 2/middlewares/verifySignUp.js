const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrRut = (req, res, next) => {
    // Rut
    User.findOne({
      rut: req.body.rut
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        return res.status(400).send({ message: "Failed! Rut is already in use!" });
      }

      // El RUT no está en uso, por lo que puedes continuar con el registro.
      next();
    });
  };




const verifySignUp = {
  checkDuplicateUsernameOrRut: checkDuplicateUsernameOrRut,
};

module.exports = verifySignUp;