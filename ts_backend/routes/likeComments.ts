const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middelwares/validar-campos');
const { likeCommentsPost,
    likeCommentsGet,
    likeCommentsDelete } = require('../controllers/likeComments');
const { findIdCom, findIdLikeComments } = require('../helpers/db-validators');
const { validarJWT } = require('../middelwares/validar-jwt');
const { idValidatorLikeComments } = require('../helpers/id-validator-likeComments');

const router = Router();

router.get('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdCom),
    validarCampos
], likeCommentsGet);

router.post('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdCom),
    validarCampos
], likeCommentsPost);

/* router.delete('/:id', [
    validarJWT,
    idValidatorLikeComments,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdLikeComments),
    validarCampos
], likeCommentsDelete); */

module.exports = router;