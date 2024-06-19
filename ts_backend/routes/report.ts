const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middelwares/validar-campos');
const { reportPost,
    reportDelete } = require('../controllers/report');
const { findId, findIdReport } = require('../helpers/db-validators');
const { validarJWT } = require('../middelwares/validar-jwt');
const { idValidatorReport } = require('../helpers/id-validator-report');

const router = Router();

router.post('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findId),
    validarCampos
], reportPost);

router.delete('/:id', [
    validarJWT,
    idValidatorReport,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdReport),
    validarCampos
], reportDelete);

module.exports = router;