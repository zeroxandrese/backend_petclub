const { Schema, model } = require('mongoose');

const SchemaTokenPoint = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    deliveryNumber: {
        type: Number,
        default: 0
    },
    lastUpdate: {
        type: Date
    }
});

SchemaTokenPoint.methods.toJSON = function () {
    const { __v, _id, ...tokenPoint } = this.toObject();
    tokenPoint.uid = _id
    return tokenPoint;
}

module.exports = model('TokenPoint', SchemaTokenPoint);