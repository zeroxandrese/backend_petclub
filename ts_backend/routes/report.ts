import { Router } from 'express';
import { check } from 'express-validator';

import validarCampos from '../middelwares/validar-campos';
import { reportPost,
    reportDelete } from '../controllers/report';
import { findId, findIdReport } from '../helpers/db-validators';
import validarJWT from '../middelwares/validar-jwt';
import idValidatorReport from '../helpers/id-validator-report';

const router = Router();

router.post('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findId),
    validarCampos
], reportPost);

router.delete('/:id', [
    validarJWT,
    idValidatorReport,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(findIdReport),
    validarCampos
], reportDelete);

export default router;