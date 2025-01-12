const { request, response } = require('express');
const { roleAdmin, roleAlumno, roleSinodal, roleDirector } = require('../helpers/db-validators');

const validarAdminRole = async(req = request, res = response, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero',
        });
    }
    const rolId = req.usuario.rol;
    try {
        await roleAdmin(rolId);
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            msg: 'No tienes permisos para realizar esta acción',
        });
    }
}
const validarAlumnoRole = async(req = request, res = response, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero',
        });
    }
    const rolId = req.usuario.rol;
    try {
        await roleAlumno(rolId);
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            msg: 'No tienes permisos para realizar esta acción',
        });
    }
}
const validarSinodalRole = async(req = request, res = response, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero',
        });
    }
    const rolId = req.usuario.rol;
    try {
        await roleSinodal(rolId);
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            msg: 'No tienes permisos para realizar esta acción',
        });
    }
}
const validarDirectorRole = async(req = request, res = response, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero',
        });
    }
    const rolId = req.usuario.rol;
    try {
        await roleDirector(rolId);
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            msg: 'No tienes permisos para realizar esta acción',
        });
    }
}

module.exports = {
    validarAdminRole,
    validarAlumnoRole,
    validarSinodalRole,
    validarDirectorRole
};
