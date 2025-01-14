const { request, response } = require("express");
const {Protocolo, Usuario} = require("../models");

const crearProtocolo = async(req = request, res = response) => {
    const { nombre, boletalider, boleta1, boleta2, descripcion, archivo = 'Archivo por defecto' } = req.body;
    try {
        const boletas = [boletalider, boleta1, boleta2].filter(boleta => boleta !== undefined && boleta.trim() !== '');
        const integrantes = await Promise.all(
            boletas.map(async (boleta) => {
                const {id} = await Usuario.findOne({ boleta });
                if (!id) {
                    throw new Error(`No se encontró un usuario con la boleta: ${boleta}`);
                }
                return id;
            })
        );
        const newProtocolo = new Protocolo({
            nombre,
            lider: integrantes[0],
            integrantes: integrantes.slice(1),
            descripcion,
            archivo
        });
        const guardado = await newProtocolo.save();
        const protocolo = await Protocolo.findById(guardado._id)
            .populate('lider', 'nombre -_id')
            .populate('integrantes', 'nombre -_id')
        res.status(201).json({
            msg: 'Protocolo creado correctamente',
            protocolo 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hubo un problema al guardar en la base de datos, inténtelo de nuevo'
        });
    }
}

const obtenerProtocoloActual = async(req = request, res = response) => {
    const { _id } = req.usuario;
    try {
        const lider = await Protocolo.findOne({ lider: _id })
            .populate('lider', 'nombre -_id')
            .populate('integrantes', 'nombre -_id');
        if (!lider) {
            const integrante = await Protocolo.findOne({ integrantes: _id })
                .populate('lider', 'nombre -_id')
                .populate('integrantes', 'nombre -_id');
            if (!integrante) {
                return res.status(400).json({
                    msg: 'No se encontró un protocolo asignado a este usuario'
                });
            }
            res.status(200).json({
                msg: 'Protocolo obtenido correctamente',
                protocolo: integrante,
            });
        }else{
            res.status(200).json({
                msg: 'Protocolo obtenido correctamente',
                protocolo: lider,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hubo un problema al obtener el protocolo, inténtelo de nuevo'
        });
    }
}
const obtenerProtocolos = (req = request, res = response) => {
    res.json({
        msg: 'controlador get-protocolos'
    });
}
const modificarProtocolo = (req = request, res = response) => {
    res.json({
        msg: 'controlador put-protocolo'
    });
}
const eliminarProtocolo = (req = request, res = response) => {
    res.json({
        msg: 'controlador delete-protocolo'
    });
}

module.exports = {
    crearProtocolo,
    obtenerProtocoloActual,
    obtenerProtocolos,
    modificarProtocolo,
    eliminarProtocolo,
};