const {Schema,model } = require('mongoose');
// ponerle new para que nos salgan las ayudas
const RoleSchema = new Schema({
    rol:{
        type: String,
        require: [true,"El rol es obligatorio"]
    }
})

module.exports = model('Role',RoleSchema);
// Los modelos siempre los vamos a poner con Mayuscula y en singular 'Role'