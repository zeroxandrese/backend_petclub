const { Schema, model } = require('mongoose');

const PaisSchema = Schema({
    pais:{
        type: String,
        required:[true, 'El pais es obligatorio']
    }
});

module.exports = model('Pais',PaisSchema);