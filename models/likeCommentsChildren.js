const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const SchemaLikeCommentsChildren = Schema({
    user:{
       type: Schema.Types.ObjectId,
       ref: 'User',
       required: true
   },
   uidComments:{
    type: Schema.Types.ObjectId,
       ref: 'CommentsChildren',
       required: true
   },
   like:{
       type: Number
   },
   status:{
       type: Boolean,
       default: true,
       required: true
   },
   charged:{
       type: Date,
       default: Date.now
   }
});

SchemaLikeCommentsChildren.methods.toJSON = function(){
    const { __v, _id, ...likeCommentsChildren } = this.toObject();
    likeCommentsChildren.uid = _id
    return likeCommentsChildren;
}

SchemaLikeCommentsChildren.plugin(mongoosePaginate);

module.exports = model('LikeCommentsChildren', SchemaLikeCommentsChildren);