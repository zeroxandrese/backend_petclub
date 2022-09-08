const { Schema, model } = require('mongoose');

const SchemaLike = Schema({
    user:{
       type: Schema.Types.ObjectId,
       ref: 'User',
       required: true
   },
   uidImg:{
    type: Schema.Types.ObjectId,
       ref: 'Image',
       required: true
   },
   like:{
       type: Number
   },
   note:{
    type: String,
    required: true
   },
   status:{
       type: Boolean,
       default: true,
       required: true
   }
});

SchemaLike.methods.toJSON = function(){
    const { __v, _id, ...like } = this.toObject();
    like.uid = _id
    return like;
}

module.exports = model('Like', SchemaLike);