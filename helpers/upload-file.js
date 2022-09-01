const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFileValidation = (files, extAllowed = ['png', 'jpg', 'jpeg', 'gif'], folder = '') => {

    return new Promise((resolve, rejects) => {
        const { file } = files;
        const shortFileName = file.name.split('.')
        const extFile = shortFileName[shortFileName.length - 1];

        if (!extAllowed.includes(extFile)) {
            return rejects('Extension de archivo no permitida')
        }
        const fileNameTemp = uuidv4() + '.' + extFile;
        const uploadPath = path.join(__dirname, '../uploads/', folder, fileNameTemp);

        file.mv(uploadPath, (err) => {
            if (err) {
                rejects(err)
            }

            resolve(fileNameTemp);
        });
    });
};

module.exports={
    uploadFileValidation
}