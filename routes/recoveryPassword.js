const { Router } = require('express');
const { check } = require('express-validator');


const { recoveryPasswordPostValidation } = require('../controllers/recoveryPassword');
const {  findEmail } = require('../helpers/db-validators');


const router = Router();

router.post('/:email', [
    check('email', 'El correo es obligatorio').isEmail().not().isEmpty(),
    check('email').custom( findEmail ),
], recoveryPasswordPostValidation);

module.exports = router;