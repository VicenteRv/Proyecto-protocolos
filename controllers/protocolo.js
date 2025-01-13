const { request, response } = require("express");
const {Protocolo} = require("../models");

const crearProtocolo = (req = request, res = response) => {
    res.json({
        msg: 'controlador post-usuario'
    });
}

const obtenerProtocoloActual = (req = request, res = response) => {
    res.json({
        msg: 'controlador get-usuarioActual'
    });
}
const obtenerProtocolos = (req = request, res = response) => {
    res.json({
        msg: 'controlador get-usuarios'
    });
}
const modificarProtocolo = (req = request, res = response) => {
    res.json({
        msg: 'controlador put-usuario'
    });
}
const eliminarProtocolo = (req = request, res = response) => {
    res.json({
        msg: 'controlador delete-usuario'
    });
}

module.exports = {
    crearProtocolo,
    obtenerProtocoloActual,
    obtenerProtocolos,
    modificarProtocolo,
    eliminarProtocolo,
};