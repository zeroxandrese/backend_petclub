const { v4: uuidv4 } = require('uuid');

const uploadFileValidation = async(files, extAllowed = ['png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov']) => {

    try {
        const shortFileName = files.split('.')
        const extFile = shortFileName[shortFileName.length - 1];
        if (!extAllowed.includes(extFile)) {
            return false;
       }
       return extFile;
    } catch (error) {
        console.log(error)
    }
};

module.exports = {
    uploadFileValidation
}