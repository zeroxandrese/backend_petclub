const { Schema, model } = require('mongoose');

const SchemaComments = Schema({
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
   comments:{
       type: String
   },
   status:{
       type: Boolean,
       default: true,
       required: true
   }
});

SchemaComments.methods.toJSON = function(){
    const { __v, _id, ...comments } = this.toObject();
    comments.uid = _id
    return comments;
}

module.exports = model('Comments', SchemaComments);