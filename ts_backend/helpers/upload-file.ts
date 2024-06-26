
const uploadFileValidation = async(files: string , extAllowed = ['png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov']) => {

    try {
        
        const shortFileName = files.split('.');
        const extFile = shortFileName[shortFileName.length - 1];
        if (!extAllowed.includes(extFile)) {
            return false;
       }else{
        return extFile;
       }
    } catch (error) {
        console.log(error)
    }
};

export default uploadFileValidation;