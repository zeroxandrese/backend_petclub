const { Schema, model } = require('mongoose');

const SchemaUser = Schema({
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
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    // paises nicho USA-LATINOAMERICA, MEXICO, CENTRO-AMERICA, COLOMBIA, PERU, VENEZUELA, CHILE, ARGENTINA, PARAGUAY, URUAGUAY, ECUADOR, BOLIVAR, BRASIL
    pais: {
        type: String,
        required: true
    },
    // se calcuaria solicitando la fecha de nacimiento
    edad: {
        type: Date
    },
    role: {
        type: String,
        required: true,
        default:"MASCOTA"
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    descripcion: {
        type: String
    },
    img: {
        type: String,
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
    logoPerfil: {
        type: String,
    },
    created:{
        type: Date,
        default: Date.now
    }
});

SchemaUser.methods.toJSON = function(){
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id
    return user;
}

module.exports = model('User', SchemaUser);