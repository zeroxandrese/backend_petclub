import { Router } from 'express';
import { check } from 'express-validator';

import validarCampos from '../middelwares/validar-campos';
import { commentsChildrenGet,
    commentsChildrenPut,
    commentsChildrenPost,
    commentsChildrenDelete } from '../controllers/commentsChildren';
import { findIdCom, findIdComChil } from '../helpers/db-validators';
import validarJWT from '../middelwares/validar-jwt';
import { idValidatorComChil, idValidatorComChilOwner } from '../helpers/id-validator-commentsChildren';

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

export default router;