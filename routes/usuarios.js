const { Router } = require("express");
const { check } = require("express-validator");
const { crearUsuario, obtenerUsuarios, obtenerUsuario, borrarUsuario, activarUsuario, obtenerUsuarioActual, modificarUsuarioAdmin, modificarUsuarioActual } = require("../controllers/usuarios");
const { validarCampos } = require("../middlewares/validar-campos");
const { validacionRol, usuarioExistente, existeUsuarioDB, existeUsuarioDBdesactivado, existeUsuarioActivo, boletaExistente } = require("../helpers/db-validators");
const { validarCorreoUnico } = require("../middlewares/validar-correounico");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarAdminRole } = require("../middlewares/validar-roles");

const router = Router();
//ruta para registrar un usuario
router.post('/',[
    check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    check('boleta').notEmpty().withMessage('La boleta es obligatoria')
        .custom(boletaExistente),
    check('correo').notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('El correo no es valido')
        .custom(usuarioExistente),
    check('password').notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({min:8}).withMessage('La contraseña debe de tener mas de 8 caracteres'),
    check('rol').notEmpty().withMessage('El tipo de usuario es obligatorio')
        .custom(validacionRol),
    validarCampos
],crearUsuario);
//ruta para obtener el usuario actual
router.get('/me',[
    validarJWT,
    validarCampos
],obtenerUsuarioActual);
//ruta para obtener todos los usuarios
router.get('/',[
    validarJWT,
    validarCampos
],obtenerUsuarios);
//ruta para buscar un usuario - solo aministrador
router.get('/admin/:id',[
    validarJWT,
    validarAdminRole,
    check('id').notEmpty().withMessage('El id es obligatorio'),
    check('id').isMongoId().withMessage('No es un id valido de mongo'),
    check('id').custom(existeUsuarioDB),
    check('id').custom(existeUsuarioActivo),
    validarCampos
],obtenerUsuario);
//ruta para modificar usuario actual - usuario
router.put('/',[
    validarJWT,
    check('nombre').optional().notEmpty().withMessage('El nombre es obligatorio'),
    check('correo').optional().notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('El correo no es valido'),
    validarCorreoUnico,
    check('password').optional().notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({min:8}).withMessage('La contraseña debe de tener mas de 8 caracteres'),
    validarCampos
],modificarUsuarioActual);
//ruta para modificar usuario - solo admin
router.put('/admin/:id',[
    validarJWT,
    validarAdminRole,
    check('id').notEmpty().withMessage('El id es obligatorio'),
    check('id').isMongoId().withMessage('No es un id valido de mongo'),
    check('id').custom(existeUsuarioDB),
    check('id').custom(existeUsuarioActivo),
    check('rol').optional().notEmpty().withMessage('El rol es obligatorio')
            .custom(validacionRol),
    check('boleta').optional().notEmpty().withMessage('La boleta es obligatoria')
            .custom(boletaExistente),
    validarCampos
],modificarUsuarioAdmin);
//ruta para descativar usuario - solo admin
router.delete('/admin/:id',[
    validarJWT,
    validarAdminRole,
    check('id').notEmpty().withMessage('El id es obligatorio'),
    check('id').isMongoId().withMessage('No es un id valido de mongo'),
    check('id').custom(existeUsuarioDB),
    check('id').custom(existeUsuarioActivo),
    validarCampos
],borrarUsuario)
//ruta para activar usuario - solo admin
router.patch('/admin/:id',[
    validarJWT,
    validarAdminRole,
    check('id').notEmpty().withMessage('El id es obligatorio'),
    check('id').isMongoId().withMessage('No es un id valido de mongo'),
    check('id').custom(existeUsuarioDBdesactivado),
    validarCampos
],activarUsuario)
module.exports = router;