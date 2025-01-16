const validarCampos = require('../middlewares/validar-campos');
const validarCorreoUnico = require('../middlewares/validar-correounico');
const validarEstadoProtocolo = require('../middlewares/validar-estado-protocolo');
const validarIntegrantes = require('../middlewares/validar-integrantes');
const validarJWT = require('../middlewares/validar-jwt');
const validarRoles = require('../middlewares/validar-roles');
const validarArchivo = require('../middlewares/validar-archivo');

module.exports = {
    ...validarCampos,
    ...validarCorreoUnico,
    ...validarEstadoProtocolo,
    ...validarIntegrantes,
    ...validarJWT,
    ...validarRoles,
    ...validarArchivo,
};