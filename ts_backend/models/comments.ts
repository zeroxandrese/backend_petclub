const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const SchemaComments = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uidImg: {
        type: Schema.Types.ObjectId,
        ref: 'Image',
        required: true
    },
    comments: {
        type: String
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

SchemaComments.methods.toJSON = function () {
    const { __v, _id, ...comments } = this.toObject();
    comments.uid = _id
    return comments;
};

SchemaComments.plugin(mongoosePaginate);

module.exports = model('Comments', SchemaComments);