import { Router } from 'express';
import { check } from 'express-validator';

import validarCampos from '../middelwares/validar-campos';
import { likePost,
    likeGet,
    likeDelete } from '../controllers/like';
import { findIdImg, findIdLike } from '../helpers/db-validators';
import validarJWT from '../middelwares/validar-jwt';
import idValidatorLike from '../helpers/id-validator-like';

const router = Router();

router.get('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdImg),
    validarCampos
], likeGet);

router.post('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdImg),
    validarCampos
], likePost);

/* router.delete('/:id', [
    validarJWT,
    idValidatorLike,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdLike),
    validarCampos
], likeDelete); */

export default router;