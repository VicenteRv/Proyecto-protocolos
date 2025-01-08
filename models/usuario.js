const {Schema,model} = require('mongoose');
const UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required:  [true,'El nombre es obligatorio'],
    },
    correo: {
        type: String,
        required:  [true,'El correo es obligatorio'],
        unique: true
    }, 
    password: {
        type: String,
        required:  [true,'La contraseña es obligatoria'],
    },
    rol: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    },
    estado: {
        type: Boolean,
        default: true,  
    }, 
});

UsuarioSchema.methods.toJSON = function(){
  const {__v,_id, ...usuario } = this.toObject();
  usuario.uid=_id;    
  return usuario; 
}

module.exports = model('Usuario',UsuarioSchema);