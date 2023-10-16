const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middelwares/validar-campos');
const { imagesPost, imagesDelete, imagesGet, imagesPut } = require('../controllers/image');
const { findIdImg, isActionPlan } = require('../helpers/db-validators');
const { validarJWT } = require('../middelwares/validar-jwt');
const { idValidatorImg } = require('../helpers/id-validator-img');
const { verifyUploadFile } = require('../middelwares/validar-archivo');

const router = Router();

router.get('/',[
    validarJWT,
    validarCampos
] ,imagesGet);

router.put('/:id', [
    validarJWT,
    idValidatorImg,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(findIdImg),
    validarCampos
],imagesPut);

router.post('/', [
    validarJWT,
    verifyUploadFile,
/*     check('actionPlan').custom(isActionPlan), */
    validarCampos
], imagesPost);

router.delete('/:id', [
    validarJWT,
    idValidatorImg,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(findIdImg),
    validarCampos
], imagesDelete);

module.exports = router;