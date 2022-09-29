const { response, query } = require('express');

const { Alerts } = require('../models/index');

const alertsPost = async (req, res = response) => {

    const uid = await req.userAuth;
    const { alert, note } = req.body;
    const id = req.params.id;
    if (!note) {
        return res.status(401).json({
            msg: 'Necesita enviar una interacción'
        })
    }
    const data = {
        user: uid._id,
        uidImg: id,
        alert,
        note
    }

    const alerts = new Alerts(data);

    await alerts.save();

    res.status(201).json(alerts);
};

const alertsDelete = async (req, res = response) => {
    const id = req.params.id;
    //Borrar comentario permanentemente
    //const comments = await Comments.findByIdAndDelete( id );

    //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
    const alert = await Alerts.findByIdAndUpdate(id, { status: false });

    res.status(201).json({ alert });
};

module.exports = {
    alertsPost,
    alertsDelete
}