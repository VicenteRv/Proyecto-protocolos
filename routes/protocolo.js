const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { crearProtocolo, obtenerProtocoloActual, obtenerProtocolos, modificarProtocolo, eliminarProtocolo } = require("../controllers/protocolo");
const { validarAlumnoRole } = require("../middlewares/validar-roles");
const { validarIntegrantesUsuarioRol } = require("../middlewares/validar-integrantes");

const router = Router();
//ruta para registrar un protocolo
router.post('/',[
    validarJWT,
    validarAlumnoRole,
    validarIntegrantesUsuarioRol,
    check('nombre').notEmpty().withMessage('El nombre del protocolo es obligatorio'),
    check('boletalider').notEmpty().withMessage('La boleta del líder del equipo es obligatorio'),
    check('boleta1').optional().notEmpty().withMessage('Faltan datos del segundo integrante'),
    check('boleta2').optional().notEmpty().withMessage('Faltan datos del tercer integrante'),
    check('descripcion').notEmpty().withMessage('La descripción del protocolo es obligatoria'),
    // check('archivo').notEmpty().withMessage('El archivo es obligatorio'),   
    validarCampos,
],crearProtocolo);
//ruta para obtener el protocolo del usuario loggeado
router.get('/me',[
    validarJWT,
    validarCampos
],obtenerProtocoloActual);
//ruta para obtener todos los protocolos
router.get('/',[
],obtenerProtocolos);
//ruta para modificar protocolo - admin
router.put('/:id',[
],modificarProtocolo);
//ruta para eliminar protocolo - admin
router.delete('/:id',[
],eliminarProtocolo);

module.exports = router;