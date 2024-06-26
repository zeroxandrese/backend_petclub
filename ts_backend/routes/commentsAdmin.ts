import { Router } from 'express';
import { check } from 'express-validator';

import validarCampos from '../middelwares/validar-campos';
import commentsAdminPost from '../controllers/commentsAdmin';
import validarJWT from '../middelwares/validar-jwt';


const router = Router();

router.post('/', [
    validarJWT,
    validarCampos
], commentsAdminPost);

export default router;