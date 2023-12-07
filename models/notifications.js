const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const SchemaNotifications = Schema({
    userOwner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uidImg: {
        type: Schema.Types.ObjectId,
        ref: 'Image',
        required: true
    },
    userSender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event:{
        type: String,
        required:[true, 'El evento es obligatorio']
    },
    statusSeen: {
        type: Boolean,
        default: false,
        required: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    charged: {
        type: Date,
        default: Date.now
    }
});

SchemaNotifications.methods.toJSON = function () {
    const { __v, _id, ...notifications } = this.toObject();
    notifications.uid = _id
    return notifications;
}

SchemaNotifications.plugin(mongoosePaginate);

module.exports = model('Notifications', SchemaNotifications);