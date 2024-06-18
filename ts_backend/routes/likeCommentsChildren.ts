const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middelwares/validar-campos');
const { likeCommentsChildrenPost,
    likeCommentsChildrenGet,
    likeCommentsChildrenDelete } = require('../controllers/likeCommentsChildren');
const { findIdComChild, findIdLikeCommentsChildren } = require('../helpers/db-validators');
const { validarJWT } = require('../middelwares/validar-jwt');
const { idValidatorLikeCommentsChildren } = require('../helpers/id-validator-likeCommentsChildren');

const router = Router();

router.get('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdComChild),
    validarCampos
], likeCommentsChildrenGet);

router.post('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdComChild),
    validarCampos
], likeCommentsChildrenPost);

/* router.delete('/:id', [
    validarJWT,
    idValidatorLikeCommentsChildren,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdLikeCommentsChildren),
    validarCampos
], likeCommentsChildrenDelete); */

module.exports = router;