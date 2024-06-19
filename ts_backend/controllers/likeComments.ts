const { response, query } = require('express');

const { LikeComments } = require('../models/index');

const likeCommentsGet = async (req, res = response) => {
    const id = req.params.id;
    const { page } = req.query;
    const options = { page: page || 1, limit: 10 };
    const query = { uidComments: id, status: true };

    // se estan enviando dos promesas al mismo tiempo para calcular el paginado de likes
    const likeComments = await LikeComments.paginate(query, options)
        res.status(201).json(likeComments);
};

const likeCommentsPost = async (req, res = response) => {

    const uid = await req.userAuth;
    const { like } = req.body;
    const id = req.params.id;
    if (!like) {
        return res.status(401).json({
            msg: 'Necesita enviar una interaccion'
        })
    }
    const data = {
        user: uid._id,
        uidComments: id,
        like
    }

    const likesComments = new LikeComments(data);

    await likesComments.save();

    res.status(201).json(likesComments);
};

const likeCommentsDelete = async (req, res = response) => {
    const id = req.params.id;
    //Borrar comentario permanentemente
    //const comments = await Comments.findByIdAndDelete( id );

    //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
    const likesComments = await LikeComments.findByIdAndUpdate(id, { status: false });

    res.status(201).json({ likesComments });
};

module.exports = {
    likeCommentsGet,
    likeCommentsPost,
    likeCommentsDelete
}