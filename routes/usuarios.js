const { Router } = require("express");
const { crearUsuario, obtenerUsuarios, obtenerUsuario, modificarUsuario, borrarUsuario } = require("../controllers/usuarios");

const router = Router();

router.post('/',[
    
],crearUsuario);

router.get('/:id',[
    
],obtenerUsuarios);

router.get('/',[
    
],obtenerUsuario);

router.put('/',[
    
],modificarUsuario);

router.delete('/',[
    
],borrarUsuario)

module.exports = router;