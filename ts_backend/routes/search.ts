import { Router } from 'express';
import { check } from 'express-validator';

import searchGet from '../controllers/search';
import validarJWT from '../middelwares/validar-jwt';

const router = Router();

router.get('/:collection/:term', [ 
    validarJWT 
],
searchGet)

export default router;