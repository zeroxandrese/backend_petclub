import { response, request  } from 'express';
import type { NextFunction, Request } from 'express';

const idValidator = async (req=request, res=response, next: NextFunction) => {
    const uid = await req.userAuth
    const id = req.params.id;

    const uid1 = JSON.stringify(uid?.uid)
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

export default idValidator;