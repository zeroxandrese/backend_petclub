const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middelwares/validar-campos');
const { likePost,
    likeGet,
    likeDelete } = require('../controllers/like');
const { findIdImg, findIdLike } = require('../helpers/db-validators');
const { validarJWT } = require('../middelwares/validar-jwt');
const { idValidatorLike } = require('../helpers/id-validator-like');

const router = Router();

router.get('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdImg),
    validarCampos
], likeGet);

router.post('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdImg),
    validarCampos
], likePost);

/* router.delete('/:id', [
    validarJWT,
    idValidatorLike,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdLike),
    validarCampos
], likeDelete); */

module.exports = router;