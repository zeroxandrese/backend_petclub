const { Schema, model } = require('mongoose');

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
    comments:{
        type: String
    },
    like:{
        type: Number
    },
    alert:{
        type: Number
    },
    charged:{
        type: Date,
        default: Date.now
    }
});

module.exports = model('Image', SchemaImg);