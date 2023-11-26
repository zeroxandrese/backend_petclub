const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middelwares/validar-campos');
const { commentsGet,
    commentsPut,
    commentsPost,
    commentsDelete,
    twoCommentsGet } = require('../controllers/comments');
const { findIdImg, findIdCom, findIdImgCom } = require('../helpers/db-validators');
const { validarJWT } = require('../middelwares/validar-jwt');
const { idValidatorCom, idValidatorComOwner } = require('../helpers/id-validator-comments');

const router = Router();

router.get('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdImgCom),
    validarCampos
], commentsGet);

router.get('/twoComments/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdImgCom),
    validarCampos
], twoCommentsGet);

router.put('/:id', [
    validarJWT,
    idValidatorCom,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdCom),
    validarCampos
], commentsPut);

router.post('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdImg),
    validarCampos
], commentsPost);

router.delete('/:id', [
    validarJWT,
    idValidatorComOwner,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdCom),
    validarCampos
], commentsDelete);

module.exports = router;