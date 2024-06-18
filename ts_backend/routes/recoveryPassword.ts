const { Router } = require('express');
const { check } = require('express-validator');

const { recoveryPasswordPostValidation } = require('../controllers/recoveryPassword');

const router = Router();

router.post('/:email', [
    check('email', 'El correo es obligatorio').isEmail().not().isEmpty(),
], recoveryPasswordPostValidation);

module.exports = router;