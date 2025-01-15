const { request, response } = require('express');
const estadosProtocolo = require('../config/estados');

const validarEstadoProtocolo = (req = request, res = response, next)=>{
    const {estado} = req.body;
    if(!estado){
        return res.status(400).json({
            msg:'El estado del protocolo es obligatorio'
        })
    }
    if(!estadosProtocolo.includes(estado)){
        return res.status(400).json({
            msg: `El estado '${estado}' no es válido. Los estados permitidos son: ${estadosProtocolo.join(', ')}` 
        })
    }
    next();
}

module.exports = {
   validarEstadoProtocolo
};

