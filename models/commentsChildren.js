const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const SchemaCommentsChildren = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uidCommentsFather: {
        type: Schema.Types.ObjectId,
        ref: 'Comments',
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
    nombreUserSender: {
        type: String,
        required: true
    },
    ImgUserSender: {
        type: String,
        /* required: true */
    },
    likes: {
        type: Number
    },
    
});

SchemaCommentsChildren.methods.toJSON = function () {
    const { __v, _id, ...commentsChildren } = this.toObject();
    commentsChildren.uid = _id
    return commentsChildren;
};

SchemaCommentsChildren.plugin(mongoosePaginate);

module.exports = model('CommentsChildren', SchemaCommentsChildren);