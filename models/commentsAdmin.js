const { Schema, model } = require('mongoose');

const SchemaCommentsAdmin = Schema({
    user:{
       type: Schema.Types.ObjectId,
       ref: 'User',
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

SchemaCommentsAdmin.methods.toJSON = function(){
    const { __v, _id, ...commentsAdmin } = this.toObject();
    commentsAdmin.uid = _id
    return commentsAdmin;
}

module.exports = model('CommentsAdmin', SchemaCommentsAdmin);