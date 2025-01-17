const { Schema, model } = require('mongoose');
const arrayLimit3 = (val) => val.length <= 3;
const arrayLimit2 = (val) => val.length <= 2;
const ProtocoloSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del protocolo es obligatorio']
    },
    lider: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El líder del equipo es obligatorio'],
    },
    integrantes: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Usuario'
            }
        ],
        validate: {
            validator: arrayLimit2,
            message: 'El protocolo no puede tener más de 2 integrantes'
        }
    },
    directores: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Usuario'
            }
        ],
        validate: {
            validator: arrayLimit2,
            message: 'El protocolo no puede tener más de 2 directores'
        }
    },
    sinodales: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Usuario'
            }
        ],
        validate: {
            validator: arrayLimit3,
            message: 'El protocolo no puede tener más de 3 sinodales'
        }
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    archivo: {
        type: String,
        required: [true, 'El archivo del protocolo es obligatorio'],
    },
    estado: {
        type: String,
        enum: ['Pendiente', 'Aprobado', 'Rechazado'],
        default: 'Pendiente'
    }
});

ProtocoloSchema.methods.toJSON = function () {
    const { __v, _id, ...protocolo } = this.toObject();
    protocolo.uid = _id;
    return protocolo;
};

module.exports = model('Protocolo', ProtocoloSchema);
