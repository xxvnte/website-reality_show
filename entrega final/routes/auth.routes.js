const { verifySignUp } = require("../middleware");
const controller = require("../controllers/authController");


router.post(
  '/register',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'Por favor incluye un correo válido').isEmail(), // Verifica el correo en lugar del rut
    check(
      'password',
      'Por favor ingresa una contraseña con 6 o más caracteres'
    ).isLength({ min: 6 }),
  ],
  [
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRolesExisted
  ],
  controller.signup,
  register
);

module.exports = router;
