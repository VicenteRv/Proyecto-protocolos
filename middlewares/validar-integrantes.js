const { request, response } = require("express");
const { esAlumnoBoleta } = require("../helpers/db-validators");
const { Usuario, Protocolo } = require("../models");
const e = require("express");

const validarIntegrantesUsuarioRol = async(req = request, res = response, next) => {
    const { boletalider, boleta1, boleta2 } = req.body;
    const boletas = [boletalider, boleta1, boleta2].filter(
        (boleta) => boleta !== undefined && boleta.trim() !== ""
    );
    const boletasNoValidas = [];
    for (const boleta of boletas) {
        const usuario = await Usuario.findOne({ boleta });
        if (!usuario) {
            boletasNoValidas.push(boleta);
        }
    }
    if (boletasNoValidas.length > 0) {
        return res.status(400).json({
            msg: "Algunas boletas no existen en la base de datos",
            boletasNoValidas,
        });
    }
    const mapaBoletas = new Map();
    const duplicados = [];
    for (let i = 0; i < boletas.length; i++) {
        const boleta = boletas[i];
        if (mapaBoletas.has(boleta)) {
            duplicados.push(mapaBoletas.get(boleta), `boleta${1+i}`);
        } else {
            mapaBoletas.set(boleta, `boleta${1+i}`);
        }
    }
    if (duplicados.length > 0) {
        return res.status(400).json({
            msg: "Existen boletas repetidas",
            duplicados: [...new Set(duplicados)],
        });
    }
    try {
        const idsBoletas = [];
        for (const boleta of boletas) {
            const usuario = await Usuario.findOne({ boleta });
            if (usuario) {
                idsBoletas.push(usuario._id);
            }
        }
        for (const idBoleta of idsBoletas) {
            const usuarioAsignado = await Protocolo.findOne({ 
                $or: [{ lider: idBoleta }, { integrantes: idBoleta }]
            });
            if (usuarioAsignado) {
                return res.status(400).json({
                    msg: `La boleta ${boletas[idsBoletas.indexOf(idBoleta)]} ya está asignada a otro protocolo`,
                });
            }
        }
        for (const boleta of boletas) {
            await esAlumnoBoleta(boleta);
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: error.message,
        });
    }
    next();
};

module.exports = {
    validarIntegrantesUsuarioRol
};
