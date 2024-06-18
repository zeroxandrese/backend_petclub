const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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

SchemaLike.methods.toJSON = function(){
    const { __v, _id, ...like } = this.toObject();
    like.uid = _id
    return like;
}

SchemaLike.plugin(mongoosePaginate);

module.exports = model('Like', SchemaLike);