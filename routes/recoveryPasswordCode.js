const { Router } = require('express');
const { check } = require('express-validator');


const { recoveryPasswordPost } = require('../controllers/recoveryPassword');
const { validarCampos } = require('../middelwares/validar-campos');

const router = Router();

router.post('/:email', [
    check('email', 'El correo es obligatorio').isEmail().not().isEmpty(),
    validarCampos
], recoveryPasswordPost);

module.exports = router;