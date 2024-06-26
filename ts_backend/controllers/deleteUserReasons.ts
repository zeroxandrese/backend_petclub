import { response, query } from 'express';
import { PrismaClient } from '@prisma/client';

interface AuthenticatedRequest extends Request {
    userAuth?: {
        _id: string;
    }
}

const prisma = new PrismaClient();

const deleteUserReasonsPost = async (req: any, res = response) => {

    const uid = await req.userAuth;
    const { alert, note } = req.body;
    if (!note) {
        return res.status(401).json({
            msg: 'Necesita enviar una interacción'
        })
    }

    await prisma.deleteUserReasons.create({
        data: {
            user: uid.uid,
            alert,
            note
        }
    });

    await prisma.user.update({ where: { uid: uid.uid }, data: { status: false } });

    res.status(201).json({
        msg: 'Razones de eliminación enviadas de manera satisfactoria'
    });
};

const deleteUserReasonsDelete = async (req: any, res = response) => {
    const uid = req.userAuth;
    //const deleteUserReasons = await DeleteUserReasons.findByIdAndDelete( id );
    try {
        //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
        const idDelete = await prisma.deleteUserReasons.findUnique({ where: { uid: uid.uid } })

        if (!idDelete) {
            return res.status(401).json({
                msg: 'Usuario no identificado'
            })
        }

        await prisma.deleteUserReasons.update({
            where: { uid: idDelete.uid }
            , data: { status: false }
        });
        const userReturn = await prisma.user.update({ where: { uid: uid.uid }, data: { status: true } });

        res.status(201).json({ userReturn });
    } catch (error) {
        res.status(500).json({ error: 'Error contacte al admin' });
    }
}


export {
    deleteUserReasonsPost,
    deleteUserReasonsDelete
}