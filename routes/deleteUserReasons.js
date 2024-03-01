const { Router } = require('express');

const { validarCampos } = require('../middelwares/validar-campos');
const {  deleteUserReasonsPost,
    deleteUserReasonsDelete } = require('../controllers/deleteUserReasons');
const { validarJWT } = require('../middelwares/validar-jwt');

const router = Router();

router.post('/', [
    validarJWT,
    validarCampos
], deleteUserReasonsPost);

router.delete('/', [
    validarJWT
], deleteUserReasonsDelete);

module.exports = router;