const { Schema, model } = require('mongoose');

const SchemaDeleteUserReasons = Schema({
    user:{
       type: Schema.Types.ObjectId,
       ref: 'User',
       required: true
   },
   alert:{
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
   },
   charged:{
       type: Date,
       default: Date.now
   }
});

SchemaDeleteUserReasons.methods.toJSON = function(){
    const { __v, _id, ...deleteUserReasons } = this.toObject();
    deleteUserReasons.uid = _id
    return deleteUserReasons;
}

module.exports = model('DeleteUserReasons', SchemaDeleteUserReasons);