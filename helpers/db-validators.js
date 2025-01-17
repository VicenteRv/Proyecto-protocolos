const ROLES = require("../config/roles");
const {Role,Usuario,Protocolo} = require("../models");

//Usuarios
const usuarioExistente = async(correo = '')=>{
    const existeUsuario = await Usuario.findOne({correo});
    if(existeUsuario){
        throw new Error(`El correo: ${correo} ya esta registrado en la bd`)
    }
}
const boletaExistente = async(boleta = '')=>{
    const existeBoleta = await Usuario.findOne({ boleta });
    const existeCedula = await Usuario.findOne({ cedula: boleta });

    if (existeBoleta || existeCedula)  {
        const campo = existeBoleta ? 'boleta' : 'cedula';
        throw new Error(`El dato ingresado ${boleta} ya está registrada en la BD`);
    }
}
const esAlumnoBoleta = async(boleta = '')=>{
    const existeBoleta = await Usuario.findOne({boleta});
    const rol = await Role.findById(existeBoleta.rol);
    if(!rol){
        throw new Error(`El rol del usuario con boleta: ${boleta} no esta registrado en la bd`)
    }
    if(rol.rol !== ROLES.ALUMNO){
        throw new Error(`La boleta: ${boleta} no pertenece a un alumno`)
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
const existeUsuarioActivo = async(id)=>{
    const existe = await Usuario.findOne({_id:id,estado:true});
    if(!existe){
        throw new Error(`El usuario con id: ${id} no existe o esta desactivado`)
    }
}
const exceptoActual = async(correo,id)=>{
    const existeUsuario = await Usuario.findOne({correo});
    if(existeUsuario && existeUsuario._id != id){
        throw new Error(`El correo: ${correo} ya esta registrado en la bd`)
    }
}

const existeUsuarioDBdesactivado = async(id)=>{
    const existe = await Usuario.findOne({_id:id,estado:false});
    if(!existe){
        throw new Error(`El usuario con id: ${id} no existe o esta activo`)
    }
}

const validarCorreoUsuario = async(correo = '')=>{
    const existeUsuario = await Usuario.findOne({correo});
    if(!existeUsuario){
        throw new Error(`El correo/contraseña son incorrectos - correo`)
    }
}
const boletaExiste = async(boleta) =>{ 
    const boletaExiste = await Usuario.findOne({ boleta });
    const cedulaExiste = await Usuario.findOne({ cedula: boleta });
    if (!boletaExiste || !cedulaExiste)  {
        throw new Error(`La boleta ${boleta} ingresada no existe en la bd `);
    }
}
//verificar roles
const roleAdmin = async(id)=>{
    const esRolAdmin = await Role.findById(id);
    if(!esRolAdmin){
        throw new Error(`El rol con id ${id} no existe en la bd`)
    }
    if(esRolAdmin.rol !== ROLES.ADMIN){
        throw new Error(`El usuario no es un administrador`)
    }
}
const roleAlumno = async(id)=>{
    const esRolAlumno = await Role.findById(id);
    if(!esRolAlumno){
        throw new Error(`El rol con id ${id} no existe en la bd`)
    }
    if(esRolAlumno.rol !== ROLES.ALUMNO){
        throw new Error(`El usuario no es un alumno`)
    }
}
const roleProfesor = async(id)=>{
    const esRolProfesor = await Role.findById(id);
    if(esRolProfesor.rol !== ROLES.PROFESOR){
        throw new Error(`El usuario no es un Profesor`)
    }
    return true;
}
//potocolos
const existeProtocoloDB = async(id)=>{
    const existe = await Protocolo.findById(id);
    if(!existe){
        throw new Error(`El protocolo con id: ${id} no existe`)
    }
}

module.exports = {
    usuarioExistente,
    validacionRol,
    existeUsuarioDB,
    existeUsuarioActivo,
    existeUsuarioDBdesactivado,
    exceptoActual,
    validarCorreoUsuario,
    roleAdmin,
    roleAlumno,
    roleProfesor,
    boletaExistente,
    esAlumnoBoleta,
    existeProtocoloDB,
    boletaExiste,
};