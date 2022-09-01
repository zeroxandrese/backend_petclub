const mongoose = require('mongoose');

const dbContection = async () =>{

try {
    
    await mongoose.connect( process.env.MONGODB_CNN);

    console.log('Ya estamos online Crack');

} catch (error) {
    console.log(error);
    throw new Error('Error al iniciar la bd');
}

};

module.exports = {
    dbContection
};