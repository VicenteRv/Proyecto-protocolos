const { Router } = require("express");
const { crearUsuario, obtenerUsuarios, obtenerUsuario, modificarUsuario, borrarUsuario } = require("../controllers/usuarios");
const { validarCampos } = require("../middlewares/validar-campos");
const { check } = require("express-validator");
const { validacionRol, usuarioExistente } = require("../helpers/db-validators");

const router = Router();

router.post('/',[
    check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    check('correo').notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('El correo no es valido')
        .custom(usuarioExistente),
    check('password').notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({min:8}).withMessage('La contraseña debe de tener mas de 8 caracteres'),
    check('rol').notEmpty().withMessage('El rol es obligatorio')
        .custom(validacionRol),
    validarCampos
],crearUsuario);

router.get('/:id',[
    
],obtenerUsuarios);

router.get('/',[
    
],obtenerUsuario);

router.put('/',[
    
],modificarUsuario);

router.delete('/',[
    
],borrarUsuario)

module.exports = router;