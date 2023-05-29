const { response } = require('express');

const { Report } = require('../models/index');

const reportPost = async (req, res = response) => {

    const uid = await req.userAuth;
    const { note } = req.body;
    const id = req.params.id;
    if (!note) {
        return res.status(401).json({
            msg: 'Necesita enviar una interacción'
        })
    }
    const data = {
        user: uid._id,
        uidUserReport: id,
        note
    }

    const report = new Report(data);

    await report.save();

    res.status(201).json({
        msg: 'Reporte enviado de manera satisfactoria'
    });
};

const reportDelete = async (req, res = response) => {
    const id = req.params.id;
    //Borrar comentario permanentemente
    //const comments = await Comments.findByIdAndDelete( id );

    //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
    const report = await Report.findByIdAndUpdate(id, { status: false });

    res.status(201).json({ report });
};

module.exports = {
    reportPost,
    reportDelete
}