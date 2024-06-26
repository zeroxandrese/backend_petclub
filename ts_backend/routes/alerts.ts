import { Router } from 'express';
import { check } from 'express-validator';

import validarCampos from '../middelwares/validar-campos';
import { alertsPost, alertsDelete } from '../controllers/alert';
import { findIdImg, findIdAlert } from '../helpers/db-validators';
import validarJWT from '../middelwares/validar-jwt';
import idValidatorAlert from '../helpers/id-validador-alert';

const router = Router();

router.post('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdImg),
    validarCampos
], alertsPost);

router.delete('/:id', [
    validarJWT,
    idValidatorAlert,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdAlert),
    validarCampos
], alertsDelete);

export default router;