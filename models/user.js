const { Schema, model } = require('mongoose');

const SchemaUser = Schema({
    nombre: {
        type: String,
        required: true
    },
    sexo: {
        type: String,
        default:"Otro"
    },
    password: {
        type: String,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
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
    logoPerfil: {
        type: String,
    },
    created:{
        type: Date,
        default: Date.now
    },
    googleUserId: {
        type: String,
        default: null,
      }
});

SchemaUser.methods.toJSON = function(){
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id
    return user;
}

module.exports = model('User', SchemaUser);