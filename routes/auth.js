const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { login } = require("../controllers/auth");

const router = Router();

router.post('/login',[

],login);

module.exports = router;

