const { Schema, model } = require('mongoose');

const SchemaPet = Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    sexo: {
        type: String,
        required: true
    },
    // gato, perro, conejo, cerdito, hamster, conejillo de india, pez, ave, reptil, insecto, otro, erizo
    tipo: {
        type: String,
        required: true
    },
    // se calcuaria solicitando la fecha de nacimiento
    edad: {
        type: Date
    },
    status: {
        type: Boolean,
        default: true
    },
    descripcion: {
        type: String
    },
    perdido:{
        type: Boolean,
        default: false
    },
    fechaPerdida:{
        type: Date
    },
    lugarPerdida:{
        type: String
    },
    created:{
        type: Date,
        default: Date.now
    }
});

SchemaPet.methods.toJSON = function(){
    const { __v, _id, ...pet } = this.toObject();
    pet.uid = _id
    return pet;
}

module.exports = model('Pet', SchemaPet);