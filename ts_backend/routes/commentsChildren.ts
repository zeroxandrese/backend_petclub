const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middelwares/validar-campos');
const { commentsChildrenGet,
    commentsChildrenPut,
    commentsChildrenPost,
    commentsChildrenDelete } = require('../controllers/commentsChildren');
const { findIdCom, findIdComChil } = require('../helpers/db-validators');
const { validarJWT } = require('../middelwares/validar-jwt');
const { idValidatorComChil, idValidatorComChilOwner } = require('../helpers/id-validator-commentsChildren');

const router = Router();

router.get('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdCom),
    validarCampos
], commentsChildrenGet);

router.put('/:id', [
    validarJWT,
    idValidatorComChil,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdComChil),
    validarCampos
], commentsChildrenPut);

router.post('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdCom),
    validarCampos
], commentsChildrenPost);

router.delete('/:id', [
    validarJWT,
    idValidatorComChilOwner,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdComChil),
    validarCampos
], commentsChildrenDelete);

module.exports = router;