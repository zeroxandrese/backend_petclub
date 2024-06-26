import { Router } from 'express';
import { check } from 'express-validator';

import validarCampos from '../middelwares/validar-campos';
import { likeCommentsChildrenPost,
    likeCommentsChildrenGet,
    likeCommentsChildrenDelete } from '../controllers/likeCommentsChildren';
import { findIdComChil, findIdLikeCommentsChildren } from '../helpers/db-validators';
import validarJWT from '../middelwares/validar-jwt';
import idValidatorLikeCommentsChildren from '../helpers/id-validator-likeCommentsChildren';

const router = Router();

router.get('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdComChil),
    validarCampos
], likeCommentsChildrenGet);

router.post('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdComChil),
    validarCampos
], likeCommentsChildrenPost);

/* router.delete('/:id', [
    validarJWT,
    idValidatorLikeCommentsChildren,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdLikeCommentsChildren),
    validarCampos
], likeCommentsChildrenDelete); */

export default router;