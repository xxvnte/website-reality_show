const { verifySignUp } = require("../middleware");
const controller = require("../controllers/authController");


router.post(
  '/register',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('rut', 'Por favor incluye un rut válido').isEmpty(),
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
