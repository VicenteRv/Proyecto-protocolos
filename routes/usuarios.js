const { Router } = require("express");
const { crearUsuario, obtenerUsuarios, obtenerUsuario, modificarUsuario, borrarUsuario } = require("../controllers/usuarios");
const { validarCampos } = require("../middlewares/validar-campos");
const { check } = require("express-validator");
const { validacionRol, usuarioExistente, existeUsuarioDB } = require("../helpers/db-validators");

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
//ruta protegida
router.get('/',[
    
],obtenerUsuarios);
//ruta protegida
router.get('/:id',[
    check('id').notEmpty().withMessage('El id es obligatorio'),
    check('id').isMongoId().withMessage('No es un id valido de mongo'),
    check('id').custom(existeUsuarioDB),
    validarCampos
],obtenerUsuario);
//ruta protegida
router.put('/:id',[
    check('id').notEmpty().withMessage('El id es obligatorio'),
    check('id').isMongoId().withMessage('No es un id valido de mongo'),
    check('id').custom(existeUsuarioDB),
    check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    check('correo').notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('El correo no es valido')
        .custom(usuarioExistente),
    check('password').notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({min:8}).withMessage('La contraseña debe de tener mas de 8 caracteres'),
    check('rol').notEmpty().withMessage('El rol es obligatorio')
        .custom(validacionRol).withMessage('Los roles pueden ser "ADMIN_ROL,ALUMNO_ROL,SINODAL_ROL,DIRECTOR_ROL"'),
    validarCampos
],modificarUsuario);
//ruta protegida

router.delete('/:id',[
    check('id').notEmpty().withMessage('El id es obligatorio'),
    check('id').isMongoId().withMessage('No es un id valido de mongo'),
    check('id').custom(existeUsuarioDB),
    validarCampos
],borrarUsuario)

module.exports = router;