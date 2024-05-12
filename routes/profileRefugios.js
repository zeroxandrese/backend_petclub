const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middelwares/validar-campos');
const { idValidator } = require('../helpers/id-validator');
const { validarJWT } = require('../middelwares/validar-jwt');

const router = Router();

router.get('/',[
    validarJWT,
    validarCampos
] ,);

router.put('/:id', [
    validarJWT,
    idValidator,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(),
    validarCampos
],);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de tener al menos 6 digitos').isLength({ min: 6 }),
    check('email', 'El email no es valido').isEmail(),
   // check('email').custom( findEmail ),
   // check('role').custom(isRole),
    validarCampos
], );

router.delete('/:id', [
    validarJWT,
    idValidator,
    check('id','El id no es valido').isMongoId(),
   // check('id').custom(findId),
    validarCampos
], );


module.exports = router;