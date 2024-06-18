const { Schema, model } = require('mongoose');

const SchemaUserConnect = Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    statusConnect:{
        type: Boolean,
        default: true
    },
    created:{
        type: Date,
        default: Date.now
    }
});

SchemaUserConnect.methods.toJSON = function(){
    const { __v, _id, ...userConnect } = this.toObject();
    userConnect.uid = _id
    return userConnect;
}

module.exports = model('UserConnect', SchemaUserConnect);