import { Router } from 'express';
import { check } from 'express-validator';

import { cloudinaryUploadFile, getUpload } from '../controllers/uploads';
import { collectionAllowed } from '../helpers/db-validators';
import validarJWT from '../middelwares/validar-jwt';
import validarCampos from '../middelwares/validar-campos';
import verifyUploadFile from '../middelwares/validar-archivo';
const router = Router();

router.get('/:collection/:id',[
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('collection').custom(c => collectionAllowed(c)),
    validarCampos
], getUpload);


router.put('/:collection/:id',[
    validarJWT,
    verifyUploadFile,
    check('id','El id no es valido').isMongoId(),
    check('collection').custom(c => collectionAllowed(c)),
    validarCampos
], cloudinaryUploadFile);

export default router;