const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middelwares/validar-campos');
const { alertsPost,
    alertsDelete } = require('../controllers/alert');
const { findIdImg, findIdAlert } = require('../helpers/db-validators');
const { validarJWT } = require('../middelwares/validar-jwt');
const { idValidatorAlert } = require('../helpers/id-validador-alert');

const router = Router();

router.post('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdImg),
    validarCampos
], alertsPost);

router.delete('/:id', [
    validarJWT,
    idValidatorAlert,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdAlert),
    validarCampos
], alertsDelete);

module.exports = router;