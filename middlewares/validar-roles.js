const { request, response } = require('express');
const { roleAdmin, roleAlumno, roleProfesor} = require('../helpers/db-validators');

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
const validarProfesorRole = async(req = request, res = response, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero',
        });
    }
    const rolId = req.usuario.rol;
    try {
        await roleProfesor(rolId);
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
    validarProfesorRole
};
