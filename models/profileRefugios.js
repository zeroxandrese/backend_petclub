const { Schema, model } = require('mongoose');

const SchemaProfileRefugios= Schema({
    nombre: {
        type: String,
        required: true
    },
    password: {
        type: String,
        default: null
    },
    category:{
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
    role: {
        type: String,
        required: true,
        default:"REFUGIOS"
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
    attention:{
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
      },
      representanteLegal:{
        type: String,
        default: null,
      },
      documento1:{
        type: String,
        default: null,
      },
      documento2:{
        type: String,
        default: null,
      },
      codeVerify:{
        type: Boolean,
        default: false
      }
});

SchemaProfileRefugios.methods.toJSON = function(){
    const { __v, password, _id, ...profileRefugios } = this.toObject();
    profileRefugios.uid = _id
    return profileRefugios;
}

module.exports = model('ProfileRefugios', SchemaProfileRefugios);