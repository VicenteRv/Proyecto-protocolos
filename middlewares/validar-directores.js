const { roleProfesor } = require('../helpers/db-validators');
const { Usuario } = require('../models');
const { response, request } = require('express');

const validarDirectores = async (req = request, res = response, next) => {
    const { director1, director2 } = req.body;
    try {
        if (!director1) {
            return res.status(400).json({
                msg: 'El director1 es obligatorio',
            });
        }
        const directorPrincipal = await Usuario.findOne({
            $or: [{ boleta: director1 }, { cedula: director1 }],
        }); 
        if (!directorPrincipal) {
            return res.status(400).json({
                msg: `El director principal (${director1}) no existe en la base de datos`,
            });
        }
        await roleProfesor(directorPrincipal.rol);
        if (director2) {
            const segundoDirector = await Usuario.findOne({
                $or: [{ boleta: director1 }, { cedula: director1 }],
            });
            if (!segundoDirector) {
                return res.status(400).json({
                    msg: `El segundo director (${director2}) no existe en la base de datos`,
                });
            }
            await roleProfesor(segundoDirector.rol);
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Ocurrió un error al validar los directores',
            error,
        });
    }
};

module.exports = {
    validarDirectores,
};
