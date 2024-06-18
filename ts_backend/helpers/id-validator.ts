const { response } = require("express");



const idValidator = async (req, res = response, next) => {
    const uid = await req.userAuth
    const id = req.params.id;

    const uid1 = JSON.stringify(uid._id)
    const uidUpdate = uid1.slice(1, -1)

    if (!req.userAuth) {
        return res.status(500).json({
            msg: 'Se intenta validar el id sin validar token'
        })
    }


    try {

        if (id !== uidUpdate) {
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
    idValidator
}