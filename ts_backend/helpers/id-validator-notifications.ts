import { response, request  } from 'express';
import type { NextFunction, Request } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


const idValidatorNotifications = async (req=request, res=response, next: NextFunction) => {
    const uid = await req.userAuth;
    const id = req.params.id;
    if(id === 'undefined' || id === undefined || ''){
        return res.status(400).json({
            msg: 'ID no valido'
        })
    }
    const validacionIdNotifications = await prisma.notifications.findUnique({ where: { uid: id } });

    if(validacionIdNotifications === null){
        return res.status(400).json({
            msg: 'ID no valido'
        })
    }

    const uid1 = JSON.stringify(uid?.uid);
    const uidUpdate = uid1.slice(1, -1);

    const uid2 = JSON.stringify(validacionIdNotifications.userSender);
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

export default idValidatorNotifications;