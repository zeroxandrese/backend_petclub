const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const SchemaImg = Schema({
     user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    img:{
        type: String
    },
    status:{
        type: Boolean,
        default: true,
        required: true
    },
    descripcion:{
        type: String
    },
    charged:{
        type: Date,
        default: Date.now
    },
    actionPlan:{
        type: String,
        default: "IMAGE",
        required: true
    },
    fechaEvento:{
        type: Date
    },
    longitudeEvento:{
        type: Number
    },
    lantitudeEvento:{
        type: Number
    },
    horaEvento:{
        type: Number
    },
    optionalDate:{
        type: Date
    },
    optionalString1:{
        type: String
    },
    optionalString2:{
        type: String
    },
    optionalNumber1:{
        type: Number
    },
    optionalNumber2:{
        type: Number
    }
});

SchemaImg.methods.toJSON = function(){
    const { __v, _id, ...image } = this.toObject();
    image.uid = _id
    return image;
}

SchemaImg.plugin(mongoosePaginate);

module.exports = model('Image', SchemaImg);