const { Schema, model } = require('mongoose');

const SchemaRecoveryPassword = Schema({
    user:{
       type: Schema.Types.ObjectId,
       ref: 'User',
       required: true
   },
   code:{
       type: Number
   },
   status:{
       type: Boolean,
       default: true,
       required: true
   },
   charged:{
       type: Date,
       default: Date.now,
       index: true
   }
});

SchemaRecoveryPassword.methods.toJSON = function(){
    const { __v, _id, ...recoveryPassword } = this.toObject();
    recoveryPassword.uid = _id
    return recoveryPassword;
}

module.exports = model('RecoveryPassword', SchemaRecoveryPassword);