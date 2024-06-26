import { Router } from 'express';
import { check } from 'express-validator';

import validarCampos from '../middelwares/validar-campos';
import { likeCommentsPost,
    likeCommentsGet,
    likeCommentsDelete } from '../controllers/likeComments';
import { findIdCom, findIdLikeComments } from '../helpers/db-validators';
import validarJWT from '../middelwares/validar-jwt';
import idValidatorLikeComments from '../helpers/id-validator-likeComments';

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

export default router;