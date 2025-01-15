const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { crearProtocolo, obtenerProtocoloActual, obtenerProtocolos, modificarProtocolo, eliminarProtocolo, obtenerBoletasProtocoloEditar } = require("../controllers/protocolo");
const { validarAlumnoRole, validarAdminRole } = require("../middlewares/validar-roles");
const { validarIntegrantesUsuarioRol, validarIntegrantesUsuarioRolEditar } = require("../middlewares/validar-integrantes");
const { existeProtocoloDB } = require("../helpers/db-validators");

const router = Router();
//ruta para registrar un protocolo
router.post('/',[
    validarJWT,
    validarAlumnoRole,
    check('nombre').notEmpty().withMessage('El nombre del protocolo es obligatorio'),
    check('boletalider').notEmpty().withMessage('La boleta del líder del equipo es obligatorio'),
    check('boleta1').optional().notEmpty().withMessage('Faltan datos del segundo integrante'),
    check('boleta2').optional().notEmpty().withMessage('Faltan datos del tercer integrante'),
    check('descripcion').notEmpty().withMessage('La descripción del protocolo es obligatoria'),
    // check('archivo').notEmpty().withMessage('El archivo es obligatorio'),   
    validarIntegrantesUsuarioRol,
    validarCampos,
],crearProtocolo);
//ruta para obtener el protocolo del usuario loggeado
router.get('/me',[
    validarJWT,
    validarCampos
],obtenerProtocoloActual);
//ruta para obtener todos los protocolos
router.get('/',[
    validarJWT,
    validarAdminRole,
    validarCampos
],obtenerProtocolos);
//ruta para obtener datos del protocolo a editar (boletas)
router.get('/modificar/:id',[
    validarJWT,
    validarAdminRole,
    check('id').isMongoId().withMessage('No es un id valido de mongo'),
    check('id').custom(existeProtocoloDB).withMessage('El protocolo no existe en la bd'),
    validarCampos
],obtenerBoletasProtocoloEditar);
//ruta para modificar protocolo - admin
router.put('/:id',[
    validarJWT,
    validarAdminRole,
    check('id').isMongoId().withMessage('No es un id valido de mongo'),
    check('id').custom(existeProtocoloDB).withMessage('El protocolo no existe en la bd'),
    validarIntegrantesUsuarioRolEditar,
    check('nombre').notEmpty().withMessage('El nombre del protocolo es obligatorio'),
    check('boletalider').notEmpty().withMessage('La boleta del líder del equipo es obligatorio'),
    check('boleta1').optional().notEmpty().withMessage('Faltan datos del segundo integrante'),
    check('boleta2').optional().notEmpty().withMessage('Faltan datos del tercer integrante'),
    validarCampos
],modificarProtocolo);
//ruta para eliminar protocolo - admin
router.delete('/:id',[
],eliminarProtocolo);

module.exports = router;