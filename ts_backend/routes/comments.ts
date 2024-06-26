import { Router } from 'express';
import { check } from 'express-validator';

import validarCampos from '../middelwares/validar-campos';
import { commentsGet,
    commentsPut,
    commentsPost,
    commentsDelete,
    twoCommentsGet,
    commentsGetPaginate
} from '../controllers/comments';
import { findIdImg, findIdCom, findIdImgCom } from '../helpers/db-validators';
import validarJWT from '../middelwares/validar-jwt';
import { idValidatorCom, idValidatorComOwner } from '../helpers/id-validator-comments';

const router = Router();

router.get('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdImgCom),
    validarCampos
], commentsGet);

router.get('/paginate/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdImgCom),
    validarCampos
], commentsGetPaginate);

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

export default router;