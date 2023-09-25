const { response, query } = require('express');

const { LikeComments } = require('../models/index');

const likeCommentsGet = async (req, res = response) => {
    const id = req.params.id;
    const { limite = 5, desde = 0 } = req.query;
    const query = { uidComments: id, status: true };

    // se estan enviando dos promesas al mismo tiempo para calcular el paginado de likes
    const [total, likesComments] = await Promise.all([
        LikeComments.count(query),
        LikeComments.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    if (total > 0) {
        return res.status(201).json({
            total,
            likesComments
        })
    }
    res.status(201).json({
        msg:'Whitout likes'
    })
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