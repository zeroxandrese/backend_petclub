const { response, query } = require('express');

const { Like } = require('../models/index');

const likeGet = async (req, res = response) => {
    const id = req.params.id;
    const { page } = req.query;
    const options = { page: page || 1, limit: 10 };
    const query = { uidImg: id, status: true };

    // se estan enviando dos promesas al mismo tiempo para calcular el paginado de likes
    const like = await Like.paginate(query, options)
        res.status(201).json(like);
};

const likePost = async (req, res = response) => {

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
        uidImg: id,
        like
    }

    const likes = new Like(data);

    await likes.save();

    res.status(201).json(likes);
};

const likeDelete = async (req, res = response) => {
    const id = req.params.id;
    //Borrar comentario permanentemente
    //const comments = await Comments.findByIdAndDelete( id );

    //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
    const likes = await Like.findByIdAndUpdate(id, { status: false });

    res.status(201).json({ likes });
};

module.exports = {
    likeGet,
    likePost,
    likeDelete
}