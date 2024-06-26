import { Router } from 'express';
import { check } from 'express-validator';

import validarCampos from '../middelwares/validar-campos';
import { petsGet, petsPut, petsPost, petsDelete, petsGetAllOfUser, petsGetOneOfUser } from '../controllers/pet';
import { isTipo, isSexo, isRaza, findIdPets, findId } from '../helpers/db-validators';
import validarJWT from '../middelwares/validar-jwt';
import idValidatorPet from '../helpers/id-validator-pet';
import verifyUploadFile from '../middelwares/validar-archivo';

const router = Router();

router.get('/',[
    validarJWT,
    validarCampos
] ,petsGet);

router.get('/oneofuser/:id', [
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(findIdPets),
    validarCampos
], petsGetOneOfUser);

router.get('/allofuser/:id', [
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(findId),
    validarCampos
], petsGetAllOfUser);

router.put('/:id', [
    validarJWT,
    idValidatorPet,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(findIdPets),
    validarCampos
],petsPut);

router.post('/', [
    validarJWT,
    verifyUploadFile,
/*     check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('raza').custom(isRaza),
    check('tipo').custom(isTipo), */
    validarCampos
], petsPost);

router.delete('/:id', [
    validarJWT,
    idValidatorPet,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(findIdPets),
    validarCampos
], petsDelete);


export default router;