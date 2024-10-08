import { Router } from 'express';

import validarCampos from '../middelwares/validar-campos';
import {
    deleteUserReasonsPost,
    deleteUserReasonsDelete
} from '../controllers/deleteUserReasons';
import validarJWT from '../middelwares/validar-jwt';

const router = Router();

router.post('/', [
    validarJWT,
    validarCampos
], deleteUserReasonsPost);

router.delete('/', [
    validarJWT
], deleteUserReasonsDelete);

export default router;