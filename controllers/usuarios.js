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
const obtenerUsuarios = async(req = request, res = response) => {
    const {limite = 10, desde = 0} = req.query;
    const query = {estado:true};

    try {
        const [total,usuarios] = await Promise.all([
            Usuario.countDocuments(query),
            Usuario.find(query)
            .skip(desde)
            .limit(limite)
        ])
        res.status(200).json({
            total,
            usuarios
        })    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al obtener usuarios'
        })
    }
}
const obtenerUsuario = async(req = request, res = response) => {
    const {id} = req.params;
    try {
        const usuario = await Usuario.findById(id)
            .populate('rol','rol -_id');
        res.status(200).json({
            usuario
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: `Error al obtener el usuario con id: ${id} fallo`
        })
    }
}
const modificarUsuario = async(req = request, res = response) => {
    const {id} = req.params;
    const {nombre,correo,password,rol} = req.body;
    try {
        const datosActualizados = { nombre, correo, password, rol };
        if (password) {
            const salt = bcryptjs.genSaltSync();
            datosActualizados.password = bcryptjs.hashSync(password, salt);
        }
        datosActualizados.rol = await Role.findOne({rol});
        // Actualizar el usuario en la base de datos
        const usuario = await Usuario.findByIdAndUpdate(id, datosActualizados, { new: true })
            .populate('rol','rol -_id');
        res.status(200).json({
            usuario
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al actualizar el usuario'
        });
    }
}
const borrarUsuario = async(req = request, res = response) => {
    const {id} = req.params;
    try {
        const usuario = await Usuario.findByIdAndUpdate(id,{estado:false},{new:true});
        res.status(200).json({
            msg: 'Usuario borrado',
            usuario
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al borrar el usuario'
        })
    }
}

module.exports = {
   crearUsuario,
   obtenerUsuarios,
   obtenerUsuario,
   modificarUsuario,
   borrarUsuario
};