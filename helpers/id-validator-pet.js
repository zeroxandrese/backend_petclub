const { response } = require("express");

const { Pet } = require('../models/index');


const idValidatorPet = async (req, res = response, next) => {
    const uid = await req.userAuth;
    const id = req.params.id;
    const validacionIdPet = await Pet.findById(id);

    const uid1 = JSON.stringify(uid._id);
    const uidUpdate = uid1.slice(1, -1);

    const uid2 = JSON.stringify(validacionIdPet.user);
    const uidUpdate2 = uid2.slice(1, -1);

    if (!req.userAuth) {
        return res.status(500).json({
            msg: 'Se intenta validar el id sin validar token'
        })
    }


    try {

        if (uidUpdate2 !== uidUpdate) {
            return res.status(401).json({
                msg: 'El uid no corresponde'
            });
        } else {
            next();
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            msg: 'El uid no corresponde'
        });
    }

}

module.exports = {
    idValidatorPet
}