import { Router } from 'express';
import { check } from 'express-validator';

import { recoveryPasswordPostValidation } from '../controllers/recoveryPassword';

const router = Router();

router.post('/:email', [
    check('email', 'El correo es obligatorio').isEmail().not().isEmpty(),
], recoveryPasswordPostValidation);

export default router;