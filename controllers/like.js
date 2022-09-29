const { response, query } = require('express');

const { Like } = require('../models/index');

const likeGet = async (req, res = response) => {
    const id = req.params.id;
    const { limite = 5, desde = 0 } = req.query;
    const query = { uidImg :id, status: true };

    // se estan enviando dos promesas al mismo tiempo para calcular el paginado de likes
    const [total, likes] = await Promise.all([
        Like.count(query),
        Like.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    if (total > 0) {
        return res.status(201).json({
            total,
            likes
        })
    }
    res.status(201).json({
        msg:'Imagen sin likes'
    })
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