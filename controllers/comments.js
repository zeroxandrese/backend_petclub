const { response, query } = require('express');

const { Comments, PawsCount, TokenPoint } = require('../models/index');

const commentsGet = async (req, res = response) => {
    const id = req.params.id;
    const { page } = req.query;
    const options = { page: page || 1, limit: 500 };
    const query = { uidImg :id, status: true };

    const comments = await Comments.paginate(query, options)
        res.status(201).json(comments);
};

const commentsGetPaginate = async (req, res = response) => {
    const id = req.params.id;
    const { page } = req.query;
    const options = { page: page || 1, limit: 15 };
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

    const idResult = await PawsCount.findOne({ user: uid._id });

    if (!idResult) {
        const dataPaw = {
            user: uid._id,
            paws: 1,
            lastUpdate: Date.now()
        }

        const paws = new PawsCount(dataPaw);

        await paws.save();
    } else {

        await PawsCount.findByIdAndUpdate(idResult._id, { paws: idResult.paws + 1, lastUpdate: Date.now() });

    }

    const idResultPoint = await TokenPoint.findOne({ user: uid._id });

    if (!idResultPoint) {
        const dataPoint = {
            user: uid._id,
            points: 10,
            lastUpdate: Date.now()
        }

        const point = new TokenPoint(dataPoint);

        await point.save();
    } else {

        await TokenPoint.findByIdAndUpdate(idResultPoint._id, { points: idResultPoint.points + 10, lastUpdate: Date.now() });

    }

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
    twoCommentsGet,
    commentsGetPaginate
}