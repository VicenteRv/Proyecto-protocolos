const { request, response } = require("express");
const { generarJWT } = require("../helpers/generar-jwt");
const { Usuario } = require("../models");
const bcrypt = require("bcryptjs");


const login = async(req = request, res = response) => {
    const { correo, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ correo });
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'El correo/contraseña son incorrectos - estado: false'
            });
        }
        const passValida = bcrypt.compareSync(password, usuario.password);
        if (!passValida) {
            return res.status(400).json({
                msg: 'El correo/contraseña son incorrectos - password'
            });
        }
        const token = await generarJWT(usuario.id);
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'Strict',
            secure: process.env.NODE_ENV === 'production',  // Solo se establece 'secure' en producción
            maxAge: 60 * 60 * 24 * 2 *1000,  // 1 dia de expiración
        });
        res.json({
            msg: 'inicio de sesión exitoso',
            usuario,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error el intentar iniciar sesión'
        });
    }
}

const token = async(req = request, res = response) =>{
    res.status(200).json({
        msg: 'Token verificado - correcto'
    });
}

const cerrarSesion = (req = request, res = response) =>{
    res.clearCookie('token', { 
        httpOnly: true,
        sameSite: 'Strict',
        secure: process.env.NODE_ENV === 'production'  // Solo si está en producción
    });
    return res.status(200).json({ msg: 'Sesión cerrada correctamente' });
}

module.exports = {
    login,
    token,
    cerrarSesion,
};
