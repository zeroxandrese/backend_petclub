const { Schema, model } = require('mongoose');

const SchemaReport = Schema({
    user:{
       type: Schema.Types.ObjectId,
       ref: 'User',
       required: true
   },
   uidUserReport:{
    type: Schema.Types.ObjectId,
       ref: 'User',
       required: true
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

SchemaReport.methods.toJSON = function(){
    const { __v, _id, ...report } = this.toObject();
    report.uid = _id
    return report;
}

module.exports = model('Report', SchemaReport);