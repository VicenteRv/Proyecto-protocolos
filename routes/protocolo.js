const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { existeBoletaDB } = require("../helpers/db-validators");
const { crearProtocolo, obtenerProtocoloActual, obtenerProtocolos, modificarProtocolo, eliminarProtocolo } = require("../controllers/protocolo");

const router = Router();
//ruta para registrar un protocolo
router.post('/',[
],crearProtocolo);
//ruta para obtener el protocolo del usuario loggeado
router.get('/me',[
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