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
const existeUsuarioDB = async(id)=>{
    const existe = await Usuario.findById(id);
    if(!existe){
        throw new Error(`El usuario con id: ${id} no existe`)
    }
}
const existeUsuarioDBdesactivado = async(id)=>{
    const existe = await Usuario.findOne({_id:id,estado:false});
    if(!existe){
        throw new Error(`El usuario con id: ${id} no existe o esta activo`)
    }
}
module.exports = {
    usuarioExistente,
   validacionRol,
   existeUsuarioDB,
   existeUsuarioDBdesactivado,
};