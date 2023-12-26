const authenticate = (req, res, next) => {
    if (req.session.user) {
      // El usuario está autenticado, así que definimos req.user
      req.user = req.session.user;
      next();
    } else {
      // El usuario no está autenticado, puedes manejar la redirección a una página de inicio de sesión o enviar un error.
      res.status(401).send('Acceso no autorizado');
    }
  };
  
  module.exports = authenticate;
  