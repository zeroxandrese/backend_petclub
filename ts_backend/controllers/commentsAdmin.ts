const { response, query } = require('express');

const { CommentsAdmin } = require('../models/index');

const commentsAdminPost = async (req, res = response) => {

    const uid = await req.userAuth;
    const { comments } = req.body;
    if (!comments) {
        return res.status(401).json({
            msg: 'Necesita cargar un comentario'
        })
    }
    const data = {
        user: uid._id,
        comments
    }

    const commentadmin = new CommentsAdmin(data);

    await commentadmin.save();

    res.status(201).json({
        msg:'El comentario fue cargado de manera exitosa'
    })
};

module.exports = {
    commentsAdminPost
}