const { Router } = require('express');
const { check } = require('express-validator');


const { login, googleLogin } = require('../controllers/auth');
const { validarCampos } = require('../middelwares/validar-campos');


const router = Router();

router.post('/login',[
    check('email','El correo es obligatorio').isEmail(),
    check('password', 'El password debe de tener al menos 6 digitos').not().isEmpty(),
    validarCampos
] , login);

router.post('/login/google',[
    check('googleToken','El Token es obligatorio').not().isEmpty(),
    validarCampos
] , googleLogin);

module.exports = router;