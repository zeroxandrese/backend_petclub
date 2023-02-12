const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middelwares/validar-campos');
const { petsGet, petsPut, petsPost, petsDelete, petsGetAllOfUser, petsGetOneOfUser } = require('../controllers/pet');
const { isTipo, isSexo, findIdPets, findId } = require('../helpers/db-validators');
const { validarJWT } = require('../middelwares/validar-jwt');
const { idValidatorPet } = require('../helpers/id-validator-pet');

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
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('sexo').custom(isSexo),
    check('tipo').custom(isTipo),
    validarCampos
], petsPost);

router.delete('/:id', [
    validarJWT,
    idValidatorPet,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(findIdPets),
    validarCampos
], petsDelete);


module.exports = router;