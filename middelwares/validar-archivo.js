const { response } = require('express');


const verifyUploadFile = ( req, res = response, next) =>{
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            msg: 'No files were uploaded.'
        });
    }
    if (!req.files.file || Object.keys(req.files).length === 0) {
        res.status(400).json({
            msg: 'No existen archivos para cargar.'
        });
    }

    next();
};

module.exports = {
    verifyUploadFile
}