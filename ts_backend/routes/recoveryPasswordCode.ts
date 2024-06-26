import { Router } from 'express';
import { check } from 'express-validator';


import { recoveryPasswordPost } from '../controllers/recoveryPassword';
import validarCampos from '../middelwares/validar-campos';

const router = Router();

router.post('/:email', [
    check('email', 'El correo es obligatorio').isEmail().not().isEmpty(),
    validarCampos
], recoveryPasswordPost);

export default router;