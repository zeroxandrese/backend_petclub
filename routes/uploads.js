const { Router } = require('express');
const { check } = require('express-validator');

const { uploadsFiles, cloudinaryUpdateFile, getUpload } = require('../controllers/uploads');
const { collectionAllowed } = require('../helpers/db-validators');
const { validarJWT } = require('../middelwares/validar-jwt');
const { validarCampos } = require('../middelwares/validar-campos');
const { verifyUploadFile } = require('../middelwares/validar-archivo')

const router = Router();

router.get('/:collection/:id',[
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('collection').custom( c=> collectionAllowed(c, ['users','images'])),
    validarCampos
], getUpload);

router.post('/', [
    validarJWT,
    verifyUploadFile
],
uploadsFiles);

router.put('/:collection/:id',[
    validarJWT,
    verifyUploadFile,
    check('id','El id no es valido').isMongoId(),
    check('collection').custom( c=> collectionAllowed(c, ['users','images'])),
    validarCampos
], cloudinaryUpdateFile);

module.exports = router;