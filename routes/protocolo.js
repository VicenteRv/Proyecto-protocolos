const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos , validarJWT, validarEstadoProtocolo, validarArchivoSubir, 
        validarAlumnoRole, validarAdminRole, validarIntegrantesUsuarioRol, 
        validarIntegrantesUsuarioRolEditar } = require("../middlewares");
const { crearProtocolo, obtenerProtocoloActual, obtenerProtocolos, eliminarProtocolo, obtenerBoletasProtocoloEditar, estadoProtocolo, modificarProtocoloAdmin, modificarProtocoloAlumno } = require("../controllers/protocolo");
const { existeProtocoloDB } = require("../helpers/db-validators");

const router = Router();
//ruta para registrar un protocolo
router.post('/',[
    validarJWT,
    validarAlumnoRole,
    validarArchivoSubir,
    check('nombre').notEmpty().withMessage('El nombre del protocolo es obligatorio'),
    check('boletalider').notEmpty().withMessage('La boleta del líder del equipo es obligatorio'),
    check('boleta1').optional().notEmpty().withMessage('Faltan datos del segundo integrante'),
    check('boleta2').optional().notEmpty().withMessage('Faltan datos del tercer integrante'),
    check('descripcion').notEmpty().withMessage('La descripción del protocolo es obligatoria'),
    validarIntegrantesUsuarioRol,
    validarCampos,
],crearProtocolo);
//ruta para obtener el protocolo del usuario loggeado
router.get('/me',[
    validarJWT,
    validarCampos
],obtenerProtocoloActual);
//ruta para obtener todos los protocolos
router.get('/admin',[
    validarJWT,
    validarAdminRole,
    validarCampos
],obtenerProtocolos);
//ruta para obtener datos del protocolo a editar (boletas)
router.get('/admin/modificar/:id',[
    validarJWT,
    validarAdminRole,
    check('id').isMongoId().withMessage('No es un id valido de mongo'),
    check('id').custom(existeProtocoloDB).withMessage('El protocolo no existe en la bd'),
    validarCampos
],obtenerBoletasProtocoloEditar);
//ruta para modificar protocolo - alumno
router.put('/',[
],modificarProtocoloAlumno)
//ruta para modificar protocolo - admin
router.put('/admin/:id',[
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
],modificarProtocoloAdmin);
//ruta para cambiar estado del protocolo
router.patch('/admin/:id',[
    validarJWT,
    validarAdminRole,
    check('id').isMongoId().withMessage('No es un id valido de mongo'),
    check('id').custom(existeProtocoloDB).withMessage('El protocolo no existe en la bd'),
    validarEstadoProtocolo,
    validarCampos
],estadoProtocolo)
//ruta para eliminar protocolo - admin
router.delete('/:id',[
],eliminarProtocolo);

module.exports = router;