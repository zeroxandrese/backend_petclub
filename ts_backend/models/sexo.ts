const { Schema, model } = require('mongoose');

const SexoSchema = Schema({
    sexo:{
        type: String,
        required:[true, 'El sexo es obligatorio']
    }
});

module.exports = model('Sexo',SexoSchema);