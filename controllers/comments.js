const { response, query } = require('express');

const { Comments } = require('../models/index');

const commentsGet = async (req, res = response) => {
    const id = req.params.id;
    const { page } = req.query;
    const options = { page: page || 1, limit: 500 };
    const query = { uidImg :id, status: true };

    const comments = await Comments.paginate(query, options)
        res.status(201).json(comments);
};

const twoCommentsGet = async (req, res = response) => {
    const id = req.params.id;
    const { page } = req.query;
    const options = { page: page || 1, limit: 2 };
    const query = { uidImg :id, status: true };

    const comments = await Comments.paginate(query, options)
        res.status(201).json(comments);
};

const commentsPut = async (req, res = response) => {

    const id = req.params.id;
    const { status, ...comments } = req.body;

    const comment = await Comments.findByIdAndUpdate(id, comments);

    res.status(201).json(comment);
};

const commentsPost = async (req, res = response) => {

    const uid = await req.userAuth;
    const { comments } = req.body;
    const id = req.params.id;
    if (!comments) {
        return res.status(401).json({
            msg: 'Necesita cargar un comentario'
        })
    }
    const data = {
        user: uid._id,
        uidImg: id,
        comments
    }

    const comment = new Comments(data);

    await comment.save();

    res.status(201).json(comment);
};

const commentsDelete = async (req, res = response) => {
    const id = req.params.id;
    //Borrar comentario permanentemente
    //const comments = await Comments.findByIdAndDelete( id );

    //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
    const comment = await Comments.findByIdAndUpdate(id, { status: false });

    res.status(201).json({ comment });
};

module.exports = {
    commentsGet,
    commentsPut,
    commentsPost,
    commentsDelete,
    twoCommentsGet
}