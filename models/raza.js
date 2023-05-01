const { Schema, model } = require('mongoose');

const RazaSchema = Schema({
    raza:{
        type: String,
        required:[true, 'La raza es obligatoria']
    }
});

module.exports = model('Raza',RazaSchema);