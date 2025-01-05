const { request, response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require("../models/usuario");
const Role = require("../models/role");
const crearUsuario = async(req = request, res = response) => {
    const {nombre, correo, password, rol} = req.body;
    try {
        //buscar el rol en bd para asignarlo
        const newRol = await Role.findOne({rol})
        //guardar usuario
        const usuario = new Usuario({
            nombre,
            correo,
            password,
            rol: newRol._id
        })
        //encryptar contraseña
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password,salt);
        //guardar en bd
        await usuario.save();
        res.status(201).json({
            msg: 'Usuario creado correctamente',
            usuario
        }
        )
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hubo un problema al guardar en al bd intentelo de nuevo'
        })
    }
}
const obtenerUsuarios = (req = request, res = response) => {
    res.json({
        msg: 'controller GETusarios'
    })
}
const obtenerUsuario = (req = request, res = response) => {
    res.json({
        msg: 'controller GETusario'
    })
}
const modificarUsuario = (req = request, res = response) => {
    res.json({
        msg: 'controller PUTusario'
    })
}
const borrarUsuario = (req = request, res = response) => {
    res.json({
        msg: 'controller DELETEusario'
    })
}

module.exports = {
   crearUsuario,
   obtenerUsuarios,
   obtenerUsuario,
   modificarUsuario,
   borrarUsuario
};