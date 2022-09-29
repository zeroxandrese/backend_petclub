const { Schema, model } = require('mongoose');

const SchemaAlerts = Schema({
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
   }
});

SchemaAlerts.methods.toJSON = function(){
    const { __v, _id, ...alerts } = this.toObject();
    alerts.uid = _id
    return alerts;
}

module.exports = model('Alerts', SchemaAlerts);