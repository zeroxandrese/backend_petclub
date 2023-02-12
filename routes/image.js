const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middelwares/validar-campos');
const { imagesPost, imagesDelete, imagesGet, imagesPut } = require('../controllers/image');
const { findIdImg, findIdPets } = require('../helpers/db-validators');
const { idValidatorPet } = require('../helpers/id-validator-pet');
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

router.post('/:id', [
    validarJWT,
    /* idValidatorPet, */
    check('id','El id no es valido').isMongoId(),
    check('id').custom(findIdPets),
    verifyUploadFile,
    validarCampos,
], imagesPost);

router.delete('/:id', [
    validarJWT,
    idValidatorImg,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(findIdImg),
    validarCampos
], imagesDelete);

module.exports = router;