const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middelwares/validar-campos');
const { usersGet, usersPut, usersPost, usersDelete } = require('../controllers/user');
const { isRole, isTipo, isPais, isSexo, findEmail, findId } = require('../helpers/db-validators');
const { idValidator } = require('../helpers/id-validator');
const { validarJWT } = require('../middelwares/validar-jwt');

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
    check('sexo').custom(isSexo),
    check('tipo').custom(isTipo),
    check('password', 'El password debe de tener al menos 6 digitos').isLength({ min: 6 }),
    check('email', 'El email no es valido').isEmail(),
    check('email').custom( findEmail ),
    check('pais').custom(isPais),
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


module.exports = router;