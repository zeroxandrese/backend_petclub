import { Router } from 'express';
import { check } from 'express-validator';

import { login, googleLogin, verifyToken } from '../controllers/auth';
import validarCampos from '../middelwares/validar-campos';
import validarJWT from '../middelwares/validar-jwt';


const router = Router();

router.post('/verify', [
    validarJWT
], verifyToken);

router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'El password debe de tener al menos 6 digitos').not().isEmpty(),
    validarCampos
], login);

router.post('/login/google', [
    check('googleToken', 'El Token es obligatorio').not().isEmpty(),
    validarCampos
], googleLogin);

export default router;