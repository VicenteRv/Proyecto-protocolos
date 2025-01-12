const { Router } = require("express");
const { check } = require("express-validator");
const { crearUsuario, obtenerUsuarios, obtenerUsuario, modificarUsuario, borrarUsuario, activarUsuario } = require("../controllers/usuarios");
const { validarCampos } = require("../middlewares/validar-campos");
const { validacionRol, usuarioExistente, existeUsuarioDB, existeUsuarioDBdesactivado, existeUsuarioActivo } = require("../helpers/db-validators");
const { validarCorreoUnico } = require("../middlewares/validar-correounico");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarAdminRole } = require("../middlewares/validar-roles");

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
    validarJWT,
    validarCampos
],obtenerUsuarios);
//ruta protegida
router.get('/:id',[
    validarJWT,
    check('id').notEmpty().withMessage('El id es obligatorio'),
    check('id').isMongoId().withMessage('No es un id valido de mongo'),
    check('id').custom(existeUsuarioDB),
    check('id').custom(existeUsuarioActivo),
    validarCampos
],obtenerUsuario);
//ruta protegida
router.put('/:id',[
    validarJWT,
    check('id').notEmpty().withMessage('El id es obligatorio'),
    check('id').isMongoId().withMessage('No es un id valido de mongo'),
    check('id').custom(existeUsuarioDB),
    check('id').custom(existeUsuarioActivo),
    check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    check('correo').notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('El correo no es valido'),
    validarCorreoUnico,
    check('password').notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({min:8}).withMessage('La contraseña debe de tener mas de 8 caracteres'),
    check('rol').notEmpty().withMessage('El rol es obligatorio')
        .custom(validacionRol).withMessage('Los roles pueden ser "ADMIN_ROL,ALUMNO_ROL,SINODAL_ROL,DIRECTOR_ROL"'),
    validarCampos
],modificarUsuario);
//ruta protegida - solo admin
router.delete('/:id',[
    validarJWT,
    validarAdminRole,
    check('id').notEmpty().withMessage('El id es obligatorio'),
    check('id').isMongoId().withMessage('No es un id valido de mongo'),
    check('id').custom(existeUsuarioDB),
    check('id').custom(existeUsuarioActivo),
    validarCampos
],borrarUsuario)
//ruta protegida - solo admin reactivar usuario
router.patch('/:id',[
    validarJWT,
    validarAdminRole,
    check('id').notEmpty().withMessage('El id es obligatorio'),
    check('id').isMongoId().withMessage('No es un id valido de mongo'),
    check('id').custom(existeUsuarioDBdesactivado),
    validarCampos
],activarUsuario)
module.exports = router;