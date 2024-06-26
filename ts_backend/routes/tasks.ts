import { Router } from 'express';
import { check } from 'express-validator';

import tasksGet from '../controllers/tasks';
import validarJWT from '../middelwares/validar-jwt';

const router = Router();

router.get('/', [
    validarJWT,
], tasksGet);

export default router;