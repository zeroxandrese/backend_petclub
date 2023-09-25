const { Schema, model } = require('mongoose');

const SchemaLikeComments = Schema({
    user:{
       type: Schema.Types.ObjectId,
       ref: 'User',
       required: true
   },
   uidComments:{
    type: Schema.Types.ObjectId,
       ref: 'Image',
       required: true
   },
   like:{
       type: Number
   },
   status:{
       type: Boolean,
       default: true,
       required: true
   }
});

SchemaLikeComments.methods.toJSON = function(){
    const { __v, _id, ...likeComments } = this.toObject();
    likeComments.uid = _id
    return likeComments;
}

module.exports = model('LikeComments', SchemaLikeComments);