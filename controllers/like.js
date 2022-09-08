const { response, query } = require('express');

const { Like } = require('../models/index');

const likePost = async (req, res = response) => {

    const uid = await req.userAuth;
    const { like, note } = req.body;
    const id = req.params.id;
    if (!note) {
        return res.status(401).json({
            msg: 'Necesita enviar una descripcion'
        })
    }
    const data = {
        user: uid._id,
        uidImg: id,
        like,
        note
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
    likePost,
    likeDelete,
}