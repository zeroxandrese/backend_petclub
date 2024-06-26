import { Router } from 'express';
import { check } from 'express-validator';

import validarCampos from '../middelwares/validar-campos';
import { usersGet, usersPut, usersPost, usersDelete } from '../controllers/user';
import { isRole, isSexo, findEmail, findId } from '../helpers/db-validators';
import idValidator from '../helpers/id-validator';
import validarJWT from '../middelwares/validar-jwt';

const router = Router();

router.get('/',[
    validarJWT,
    validarCampos
] ,usersGet);

router.put('/:id', [
    validarJWT,
    idValidator,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(findId),
    validarCampos
],usersPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
/*     check('sexo').custom(isSexo), */
    check('password', 'El password debe de tener al menos 6 digitos').isLength({ min: 6 }),
    check('email', 'El email no es valido').isEmail(),
    check('email').custom( findEmail ),
    check('role').custom(isRole),
    validarCampos
], usersPost);

router.delete('/:id', [
    validarJWT,
    idValidator,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(findId),
    validarCampos
], usersDelete);


export default router;