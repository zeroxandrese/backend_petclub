const { Schema, model } = require('mongoose');

const SchemaElementMapRefugios= Schema({
    uidProfileRefugios:{
        type: Schema.Types.ObjectId,
        ref: 'ProfileRefugios',
        //required: true
    },
    nombre:{
        type:String
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
    descripcion: {
        type: String
    },
    img: {
        type: String,
    },
    weekOpening:{
        type: String
    },
    weekClosing:{
        type: String
    },
    dateAttentionWeek:{
        type: String
    },
    weekendOpening:{
        type: String
    },
    weekendClosing:{
        type: String
    },
    dateAttentionWeekend:{
        type: String
    },
    phone:{
        type: Number
    },
    email:{
        type: String
    },
    created:{
        type: Date,
        default: Date.now
    },
});

SchemaElementMapRefugios.methods.toJSON = function(){
    const { __v, password, _id, ...elementMapRefugios } = this.toObject();
    elementMapRefugios.uid = _id
    return elementMapRefugios;
}

module.exports = model('ElementMapRefugios', SchemaElementMapRefugios);