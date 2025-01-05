const {Role,Usuario} = require("../models");

//Usuarios
const usuarioExistente = async(correo = '')=>{
    const existeUsuario = await Usuario.findOne({correo});
    if(existeUsuario){
        throw new Error(`El correo: ${correo} ya esta registrado en la bd`)
    }
}
const validacionRol = async(rol = '')=>{
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no esta registrado en la bd`)
    }
}
module.exports = {
    usuarioExistente,
   validacionRol,
};