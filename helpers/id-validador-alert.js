const { response } = require("express");

const { Alerts } = require('../models/index');

const idValidatorAlert = async (req, res = response, next) => {
    const uid = await req.userAuth;
    const id = req.params.id;
    const validacionIdAlert = await Alerts.findById(id);

    const uid1 = JSON.stringify(uid._id);
    const uidUpdate = uid1.slice(1, -1);

    const uid2 = JSON.stringify(validacionIdAlert.user);
    const uidUpdate2 = uid2.slice(1, -1);

    if (!req.userAuth) {
        return res.status(500).json({
            msg: 'Se intenta validar el id sin validar token'
        })
    }


    try {

        if (uidUpdate2 !== uidUpdate) {
            return res.status(401).json({
                msg: 'El uid no corresponde tiene alertas en esta foto'
            });
        }

        next();

    } catch (error) {
        console.log(error)
        return res.status(401).json({
            msg: 'El uid no corresponde'
        });
    }

}

module.exports = {
    idValidatorAlert
}