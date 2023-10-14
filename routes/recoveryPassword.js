const { Router } = require('express');
const { check } = require('express-validator');


const { recoveryPasswordPostValidation, recoveryPasswordGet } = require('../controllers/recoveryPassword');
const { validarCampos } = require('../middelwares/validar-campos');


const router = Router();

router.get('/:email', [
    check('email', 'El correo es obligatorio').isEmail().not().isEmpty(),
    validarCampos
], recoveryPasswordGet);

router.post('/:email', [
    check('email', 'El correo es obligatorio').isEmail().not().isEmpty(),
], recoveryPasswordPostValidation);

module.exports = router;