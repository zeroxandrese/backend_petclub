import { Router } from 'express';
import { check } from 'express-validator';

import validarCampos from '../middelwares/validar-campos';
import { imagesPost, imagesDelete, imagesGet, imagesPut } from '../controllers/image';
import { findIdImg, isActionPlan } from '../helpers/db-validators';
import validarJWT from '../middelwares/validar-jwt';
import idValidatorImg from '../helpers/id-validator-img';
import verifyUploadFile from '../middelwares/validar-archivo';

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

export default router;