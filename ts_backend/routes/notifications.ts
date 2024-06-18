const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middelwares/validar-campos');
const { notificationsPut } = require('../controllers/notifications');
const { findIdNotifications } = require('../helpers/db-validators');
const { idValidatorNotifications } = require('../helpers/id-validator-notifications');
const { validarJWT } = require('../middelwares/validar-jwt');

const router = Router();

router.put('/:id', [
    validarJWT,
    idValidatorNotifications,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(findIdNotifications),
    validarCampos
],notificationsPut);



module.exports = router;