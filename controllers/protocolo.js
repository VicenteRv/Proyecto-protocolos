const path = require('path');
const fs = require('fs')
const { request, response } = require("express");
const {Protocolo, Usuario} = require("../models");
const { subirArchivo } = require("../helpers/subir-archivo");

const crearProtocolo = async(req = request, res = response) => {
    const { nombre = 'prueba1', descripcion = "s/d", boletalider, boleta1, boleta2, director1, director2 } = req.body;
    try {
        // Obtener archivo del requests
        const { archivo } = req.files;

        // Renombrar y guardar el archivo
        const uuidDoc = await subirArchivo(req.files, ['pdf'], 'documents');

        // Procesar boletas e integrantes
        const boletas = [boletalider, boleta1, boleta2].filter(boleta => boleta);
        const integrantes = await Promise.all(
            boletas.map(async (boleta) => {
                const usuario = await Usuario.findOne({ boleta });
                if (!usuario) {
                    throw new Error(`No se encontró un usuario con la boleta: ${boleta}`);
                }
                return usuario.id;
            })
        );

        // Procesar directores
        const directores = [director1, director2].filter(dir => dir);
        const directoresIds = await Promise.all(
            directores.map(async (dir) => {
                const usuario = await Usuario.findOne({ $or: [{ boleta: dir }, { cedula: dir }] });
                if (!usuario) {
                    throw new Error(`No se encontró un usuario con el identificador: ${dir}`);
                }
                return usuario.id;
            })
        );

        // Crear nuevo protocolo
        const newProtocolo = new Protocolo({
            nombre,
            descripcion,
            lider: integrantes[0],
            integrantes: integrantes.slice(1),
            directores: directoresIds,
            archivo: uuidDoc,
        });

        // Guardar protocolo
        await newProtocolo.save();

        res.status(201).json({
            msg: 'Protocolo creado correctamente',
            protocolo: newProtocolo,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            msg: `Error al crear protocolo: ${error.message}`,
        });
    }








    // const { nombre, boletalider, boleta1, boleta2, descripcion, director1, director2 } = req.body;
    // const {archivo} = req.files;
    // console.log(archivo);
    // try {
    //     const boletas = [boletalider, boleta1, boleta2].filter(boleta => boleta !== undefined && boleta.trim() !== '');
    //     const boletasDir = [director1,director2].filter(boleta => boleta !== undefined && boleta.trim() !== '');
    //     const integrantes = await Promise.all(
    //         boletas.map(async (boleta) => {
    //             const {id} = await Usuario.findOne({ boleta });
    //             if (!id) {
    //                 throw new Error(`No se encontró un usuario con la boleta: ${boleta}`);
    //             }
    //             return id;
    //         })
    //     );
    //     const directores = await Promise.all(
    //         boletasDir.map(async (boleta) => {
    //             const { id } = await Usuario.findOne({
    //                 $or: [{ boleta: boleta }, { cedula: boleta }],
    //             });
    //             if (!id) {
    //                 throw new Error(`No se encontró un usuario con la boleta: ${boleta}`);
    //             }
    //             return id;
    //         })
    //     );        
    //     // const uuid = await subirArchivo(req.files,undefined,'documents')
    //     // const uuid = await subirArchivo(req.files,['pdf'],'documents')
    //     const uuidDoc = await subirArchivo(req.files,['pdf'],'documents')
    //     const newProtocolo = new Protocolo({
    //         nombre,
    //         lider: integrantes[0],
    //         integrantes: integrantes.slice(1),
    //         directores,
    //         descripcion,
    //         archivo: uuidDoc,
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
    //     res.status(400).json({
    //         msg: `Hubo un problema: ${error}`
    //     })
    // }
}

const obtenerProtocoloActual = async(req = request, res = response) => {
    const { _id } = req.usuario;
    try {
        let protocolo = undefined;
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
            protocolo = integrante;
        }else{
            protocolo = lider;
        }
        if(protocolo.archivo){
            const pathArchivo = path.join(__dirname, '../uploads','documents',protocolo.archivo);
            if(fs.existsSync(pathArchivo)){
                protocolo = protocolo.toObject();
                protocolo.archivoURL = `/uploads/documents/${protocolo.archivo}`
            }
        }
        res.status(200).json({
            msg: 'Protocolo obtenido',
            protocolo
        })
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
const modificarProtocoloAlumno = async(req = request, res = response) => {
    const {descripcion} = req.body;
    // const {archivo = false} = req.files;
    const { _id } = req.usuario;
    try {
        const protocolo = await Protocolo.findOne({ lider: _id });
        if (!protocolo) {
            return res.status(400).json({
                msg: 'No se encontro protocolo o no eres el lider de este'
            })
        }
        protocolo.descripcion = descripcion
        if(req.files && req.files.archivo){
            const pathArchivo = path.join(__dirname, '../uploads','documents',protocolo.archivo);
            if(fs.existsSync(pathArchivo)){
                fs.unlinkSync(pathArchivo);
            }
            protocolo.archivo = await subirArchivo(req.files,['pdf'],'documents');
        }
        await protocolo.save();

        res.status(200).json({
            msg: 'modificaciones realizadas en bd',
            protocolo
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: `Hubo un problema: ${error}`
        })
    }
}
const modificarProtocoloAdmin = async(req = request, res = response) => {
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
    modificarProtocoloAlumno,
    modificarProtocoloAdmin,
    estadoProtocolo,
    eliminarProtocolo,
};