const { response } = require('express');

const { DeleteUserReasons, User } = require('../models/index');

const deleteUserReasonsPost = async (req, res = response) => {

    const uid = await req.userAuth;
    const { alert, note } = req.body;
    if (!note) {
        return res.status(401).json({
            msg: 'Necesita enviar una interacción'
        })
    }
    const data = {
        user: uid._id,
        alert,
        note
    }

    const deleteUserReasons = new DeleteUserReasons(data);

    await deleteUserReasons.save();

    await User.findByIdAndUpdate(uid, { status: false });

    res.status(201).json({
        msg: 'Razones de eliminación enviadas de manera satisfactoria'
    });
};

const deleteUserReasonsDelete = async (req, res = response) => {
    const uid = await req.userAuth;
    //const deleteUserReasons = await DeleteUserReasons.findByIdAndDelete( id );

    //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
    const idDelete = await DeleteUserReasons.findOne({ uid })
    await DeleteUserReasons.findByIdAndUpdate(idDelete, { status: false });
    const userReturn = await User.findByIdAndUpdate(uid, { status: true });

    res.status(201).json({ userReturn });
};

module.exports = {
    deleteUserReasonsPost,
    deleteUserReasonsDelete
}