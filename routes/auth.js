const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { login, token } = require("../controllers/auth");
const { validarCorreoUsuario } = require("../helpers/db-validators");
const { validarJWT } = require("../middlewares");

const router = Router();

router.post('/login',[
    check('correo').notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('El correo no es válido'),
    check('correo').custom(validarCorreoUsuario),
    check('password').notEmpty().withMessage('La contraseña es obligatoria'),
    validarCampos
],login);

router.get('/verificarJWT',[
    validarJWT,
    validarCampos
],token)
module.exports = router;

