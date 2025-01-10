const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { login } = require("../controllers/auth");
const { validarCorreoUsuario } = require("../helpers/db-validators");

const router = Router();

router.post('/login',[
    check('correo').notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('El correo no es válido'),
    check('correo').custom(validarCorreoUsuario),
    check('password').notEmpty().withMessage('La contraseña es obligatoria'),
    validarCampos
],login);

module.exports = router;

