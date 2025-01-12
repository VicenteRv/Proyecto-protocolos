const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const { jwtSPK } = require('../config/config');

const validarJWT = async (req = request, res = response, next) => {
    const {token} = req.cookies;
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición',
        });
    }
    try {
        const { uid } = jwt.verify(token, jwtSPK);
        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en la bd',
            });
        }
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido - usuario desactivado',
            });
        }
        req.usuario = usuario;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({
            msg: 'Token no válido',
        });
    }
};

module.exports = {
    validarJWT,
};
