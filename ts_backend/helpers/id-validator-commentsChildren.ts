import { response, request  } from 'express';
import type { NextFunction, Request } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const idValidatorComChil = async (req=request, res=response, next: NextFunction) => {
    const uid = await req.userAuth;
    const id = req.params.id;
    if(id === 'undefined' || id === undefined || ''){
        return res.status(400).json({
            msg: 'ID no valido'
        })
    }
    const validacionIdComChil = await prisma.commentsChildren.findUnique({ where: { uid: id } });;

    if(validacionIdComChil === null){
        return res.status(400).json({
            msg: 'ID no valido'
        })
    }

    const uid1 = JSON.stringify(uid?.uid);
    const uidUpdate = uid1.slice(1, -1);

    const uid2 = JSON.stringify(validacionIdComChil.user);
    const uidUpdate2 = uid2.slice(1, -1);

    if (!req.userAuth) {
        return res.status(500).json({
            msg: 'Se intenta validar el id sin validar token'
        })
    }


    try {

        if (uidUpdate2 !== uidUpdate) {
            return res.status(401).json({
                msg: 'El uid no corresponde al creador del comentario'
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

const idValidatorComChilOwner = async (req=request, res=response, next: NextFunction) => {
    const uid = await req.userAuth;
    const id = req.params.id;

    if (!req.userAuth) {
        return res.status(500).json({
            msg: 'Se intenta validar el id sin validar token'
        })
    }
    try {
        if(id === 'undefined' || id === undefined || ''){
            return res.status(400).json({
                msg: 'ID no valido'
            })
        }
        const validacionIdCom = await prisma.commentsChildren.findUnique({ where: { uid: id } });
    
        if(validacionIdCom === null){
            return res.status(400).json({
                msg: 'ID no valido'
            })
        }
        const validacionIdCom2 = validacionIdCom.uidCommentsFather;
        const validacionIdCom3 = await prisma.comments.findUnique({ where: { uid: validacionIdCom2 } });
        const uid1 = JSON.stringify(uid?.uid);
        const uidUpdate = uid1.slice(1, -1);
        const uid2 = JSON.stringify(validacionIdCom3?.user);
        const uidUpdate2 = uid2.slice(1, -1);
        const uid3 = JSON.stringify(validacionIdCom.user);
        const uidUpdate3 = uid3.slice(1, -1);
        if (uidUpdate2 !== uidUpdate) {
            if (uidUpdate3 !== uidUpdate) {
                res.status(401).json({
                    msg: 'El uid no corresponde al creador del comentario o al dueño de la imagen'
                });
            }
        } else {
            next();
        }
    } catch (error) {
        return res.status(401).json({
            msg: 'El uid no corresponde'
        });
    }
}

export {
    idValidatorComChil,
    idValidatorComChilOwner
}