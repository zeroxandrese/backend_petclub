const { response } = require('express');

const { CommentsChildren } = require('../models/index');

const commentsChildrenGet = async (req, res = response) => {
    const id = req.params.id;
    const { page } = req.query;
    const options = { page: page || 1, limit: 500 };
    const query = { uidCommentsFather :id, status: true };

    // se estan enviando dos promesas al mismo tiempo para calcular el paginado de comentarios
    const commentsChildren = await CommentsChildren.paginate(query, options)
        res.status(201).json(commentsChildren);
};

const commentsChildrenPut = async (req, res = response) => {

    const id = req.params.id;
    const { status, ...commentsChildren } = req.body;

    const comment = await CommentsChildren.findByIdAndUpdate(id, commentsChildren);

    res.status(201).json(comment);
};

const commentsChildrenPost = async (req, res = response) => {

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
        uidCommentsFather: id,
        comments
    }

    const commentChildren = new CommentsChildren(data);

    await commentChildren.save();

    res.status(201).json(commentChildren);
};

const commentsChildrenDelete = async (req, res = response) => {
    const id = req.params.id;
    //Borrar comentario permanentemente
    //const comments = await Comments.findByIdAndDelete( id );

    //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
    const commentChildren = await CommentsChildren.findByIdAndUpdate(id, { status: false });

    res.status(201).json({ commentChildren });
};

module.exports = {
    commentsChildrenGet,
    commentsChildrenPut,
    commentsChildrenPost,
    commentsChildrenDelete
}