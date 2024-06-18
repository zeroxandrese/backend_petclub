const { Router } = require('express');

const { searchGet } = require('../controllers/search');
const { validarJWT } = require('../middelwares/validar-jwt');

const router = Router();

router.get('/:collection/:term', [ 
    validarJWT 
],
searchGet)

module.exports = router;