const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Correo
  User.findOne({
    correo: req.body.correo
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      return res.status(400).send({ message: "Failed! Email is already in use!" }); 
    }

    // El correo no está en uso, por lo que puedes continuar con el registro.
    next();
  });
};

const verifySignUp = {
checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;
