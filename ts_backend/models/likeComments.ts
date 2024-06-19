const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const SchemaLikeComments = Schema({
    user:{
       type: Schema.Types.ObjectId,
       ref: 'User',
       required: true
   },
   uidComments:{
    type: Schema.Types.ObjectId,
       ref: 'Comments',
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

SchemaLikeComments.methods.toJSON = function(){
    const { __v, _id, ...likeComments } = this.toObject();
    likeComments.uid = _id
    return likeComments;
}

SchemaLikeComments.plugin(mongoosePaginate);

module.exports = model('LikeComments', SchemaLikeComments);