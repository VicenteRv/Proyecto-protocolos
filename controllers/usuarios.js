const { request, response } = require("express");

const crearUsuario = (req = request, res = response) => {
    res.json({
        msg: 'controller POSTusuario'
    })
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