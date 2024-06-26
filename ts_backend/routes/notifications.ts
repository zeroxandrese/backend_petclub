import { Router } from 'express';
import { check } from 'express-validator';

import validarCampos from '../middelwares/validar-campos';
import notificationsPut from '../controllers/notifications';
import { findIdNotifications } from '../helpers/db-validators';
import idValidatorNotifications from '../helpers/id-validator-notifications';
import validarJWT from '../middelwares/validar-jwt';

const router = Router();

router.put('/:id', [
    validarJWT,
    idValidatorNotifications,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(findIdNotifications),
    validarCampos
],notificationsPut);



export default router;