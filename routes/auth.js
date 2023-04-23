const { Router } = require('express');
const { check } = require('express-validator');


const { login } = require('../controllers/auth');
const { validarJWT } = require('../middelwares/validar-jwt');
const { validarCampos } = require('../middelwares/validar-campos');


const router = Router();

router.post('/login',[
    check('email','El correo es obligatorio').isEmail(),
    check('password', 'El password debe de tener al menos 6 digitos').not().isEmpty(),
    validarCampos
] , login);

module.exports = router;