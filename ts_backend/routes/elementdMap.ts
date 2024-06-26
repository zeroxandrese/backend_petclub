import { Router } from 'express';

import validarCampos from '../middelwares/validar-campos';
import { searchImagesLostGet, searchRefugiosGet } from '../controllers/controllerElementsMap';
import validarJWT from '../middelwares/validar-jwt';

const router = Router();

router.post('/petLost', [
    validarJWT,
    validarCampos
], searchImagesLostGet);

router.post('/refugios', [
    validarJWT,
    validarCampos
], searchRefugiosGet);

export default router;