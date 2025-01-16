const { request, response } = require("express");
const path = require('path');
const {Protocolo, Usuario} = require("../models");

const crearProtocolo = async(req = request, res = response) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({
            msg:'No su agrego un archivo al protocolo'
    });
        return;
    }
    const {archivo} = req.files;
    uploadPath = path.join(__dirname, '../uploads/', archivo.name);

    archivo.mv(uploadPath, (err) => {
        if (err) {
            console.log(err);
        return res.status(500).json({
            err
        });
        }

        res.json({
            msg: 'File uploaded to ' + uploadPath
        });
    });
    // const { nombre, boletalider, boleta1, boleta2, descripcion, archivo = 'Archivo por defecto' } = req.body;
    // try {
    //     const boletas = [boletalider, boleta1, boleta2].filter(boleta => boleta !== undefined && boleta.trim() !== '');
    //     const integrantes = await Promise.all(
    //         boletas.map(async (boleta) => {
    //             const {id} = await Usuario.findOne({ boleta });
    //             if (!id) {
    //                 throw new Error(`No se encontró un usuario con la boleta: ${boleta}`);
    //             }
    //             return id;
    //         })
    //     );
    //     const newProtocolo = new Protocolo({
    //         nombre,
    //         lider: integrantes[0],
    //         integrantes: integrantes.slice(1),
    //         descripcion,
    //         archivo
    //     });
    //     const guardado = await newProtocolo.save();
    //     const protocolo = await Protocolo.findById(guardado._id)
    //         .populate('lider', 'nombre -_id')
    //         .populate('integrantes', 'nombre -_id')
    //     res.status(201).json({
    //         msg: 'Protocolo creado correctamente',
    //         protocolo 
    //     });
    // } catch (error) {
    //     console.log(error);
    //     res.status(500).json({
    //         msg: 'Hubo un problema al guardar en la base de datos, inténtelo de nuevo'
    //     });
    // }
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
const obtenerProtocolos = async(req = request, res = response) => {
    const { limite = 10, desde = 0 } = req.query;
    try {
        const [total,protocolos] = await Promise.all([
            Protocolo.countDocuments(),
            Protocolo.find()
            .skip(desde)
            .limit(limite)
            .populate('lider', 'nombre -_id')
            .populate('integrantes', 'nombre -_id'),
        ])
        res.status(200).json({
            total,
            protocolos
        })    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al obtener protocolos'
        })
    }
}
const obtenerBoletasProtocoloEditar = async(req = request, res = response) => {
    const { id } = req.params;
    try {
        const protocolo = await Protocolo.findById(id)
            .populate('lider','boleta -_id')
            .populate('integrantes','boleta -_id');
        
        res.status(200).json({
            nombre: protocolo.nombre,
            lider: protocolo.lider.boleta,
            integrantes: protocolo.integrantes.map(integrante=>integrante.boleta)
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hubo un problema al obtener los datos del protocolo, inténtelo de nuevo'
        });
    }
}
const modificarProtocolo = async(req = request, res = response) => {
    const { id } = req.params;
    const { nombre, boletalider, boleta1, boleta2 } = req.body;
    try {
        const protocolo = await Protocolo.findById(id);
        protocolo.nombre = nombre;
        lider = await Usuario.findOne({ boleta: boletalider });
        const nuevosIntegrantes = [];
        if (boleta1) {
            nuevosIntegrantes.push((await Usuario.findOne({ boleta: boleta1 }))._id);
        }
        if (boleta2) {
            nuevosIntegrantes.push((await Usuario.findOne({ boleta: boleta2 }))._id);
        }
        protocolo.integrantes = nuevosIntegrantes;
        await protocolo.save();
        const protocoloEditado = await Protocolo.findById(id)
        .populate('lider', 'nombre -_id')
        .populate('integrantes', 'nombre -_id');
        res.status(200).json({
            msg: 'Protocolo modificado correctamente',
            protocoloEditado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hubo un problema al modificar el protocolo, inténtelo de nuevo'
        });
    }
}
const estadoProtocolo = async(req = request, res = response) => {
    const { id } = req.params;
    const {estado} = req.body;
    try {
        const protocolo = await Protocolo.findByIdAndUpdate(id,{estado},{new:true});
        res.status(200).json({
            msg:'Estado actualizado correctamente',
            protocolo
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: 'Error al intentar cambiar el status del protocolo'
        })
    }
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
    obtenerBoletasProtocoloEditar,
    modificarProtocolo,
    estadoProtocolo,
    eliminarProtocolo,
};