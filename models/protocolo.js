const { Schema, model } = require('mongoose');
const arrayLimit = (val) => val.length <= 3;
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
            validator: arrayLimit,
            message: 'El protocolo no puede tener más de 3 integrantes'
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
            validator: arrayLimit,
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
