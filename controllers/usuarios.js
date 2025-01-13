const { request, response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require("../models/usuario");
const Role = require("../models/role");

const crearUsuario = async(req = request, res = response) => {
    const {nombre, correo, password, rol, boleta} = req.body;
    try {
        //buscar el rol en bd para asignarlo
        const newRol = await Role.findOne({rol})
        //guardar usuario
        const usuario = new Usuario({
            nombre,
            correo,
            password,
            rol: newRol._id,
            boleta
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
const obtenerUsuarioActual = async(req = request, res = response) => {
    const {nombre,correo,boleta} = req.usuario;
    res.status(200).json({
        nombre,
        correo,
        boleta
    })
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
        const usuario = await Usuario.findById(id);
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
const modificarUsuarioActual = async(req = request, res = response) => {
    const {id} = req.usuario;
    const {nombre,correo,password} = req.body;
    try {
        const datosActualizados = { };
        if (password) {
            const salt = bcryptjs.genSaltSync();
            datosActualizados.password = bcryptjs.hashSync(password, salt);
        }
        if (nombre) {
            datosActualizados.nombre = nombre;
        }
        if (correo) {
            datosActualizados.correo = correo;
        }
        if (Object.keys(datosActualizados).length === 0) {
            return res.status(400).json({
                msg: 'No se proporcionaron datos para modificar',
            });
        }
        // Actualizar el usuario en la base de datos
        const usuario = await Usuario.findByIdAndUpdate(id, datosActualizados, { new: true });
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
const modificarUsuarioAdmin = async(req = request, res = response) => {
    const {id} = req.params;
    const {rol,boleta} = req.body;
    try {
        const datosActualizados = {};
        if (rol) {
            datosActualizados.rol = await Role.findOne({rol});
        }
        if (boleta) {
            datosActualizados.boleta = boleta;
        }
        if (Object.keys(datosActualizados).length === 0) {
            return res.status(400).json({
                msg: 'No se proporcionaron datos para modificar',
            });
        }
        const usuario = await Usuario.findByIdAndUpdate(id, datosActualizados, { new: true });
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
const activarUsuario = async(req = request, res = response) => {
    const {id} = req.params;
    try {
        const usuario = await Usuario.findByIdAndUpdate(id,{estado:true},{new:true});
        res.status(200).json({
            msg: 'Usuario activado',
            usuario
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al activar el usuario'
        })
    }
}

module.exports = {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuario,
    modificarUsuarioActual,
    borrarUsuario,
    activarUsuario,
    obtenerUsuarioActual,
    modificarUsuarioAdmin
};