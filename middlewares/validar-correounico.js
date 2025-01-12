const { exceptoActual } = require('../helpers/db-validators');

const validarCorreoUnico = async(req,res,next) => {
    const { correo } = req.body;
    const { id } = req.params;
    try {
        await exceptoActual(correo, id);
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: 'Este correo ya esta registrado en la bd'
        });
    }
};


module.exports = {
    validarCorreoUnico
};