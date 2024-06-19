const { Schema, model } = require('mongoose');

const SchemaPawsCount = Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paws: {
        type: Number,
        default: 0
    },
    lastUpdate : {
            type: Date
        }
});

SchemaPawsCount.methods.toJSON = function(){
    const { __v, _id, ...pawsCount } = this.toObject();
    pawsCount.uid = _id
    return pawsCount;
}

module.exports = model('PawsCount', SchemaPawsCount);