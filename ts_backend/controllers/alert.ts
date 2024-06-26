import { response } from 'express';
import { PrismaClient } from '@prisma/client';

interface AuthenticatedRequest extends Request {
    userAuth?: {
        _id: string;
    }
}

const prisma = new PrismaClient();

const alertsPost = async (req: any, res = response) => {

    const uid = await req.userAuth;
    const { alert, note } = req.body;
    const id = req.params.id;
    try {

        if (!note) {
            return res.status(401).json({
                msg: 'Necesita enviar una interacción'
            })
        }

        await prisma.alerts.create({
            data: {
                user: uid._id,
                uidImg: id,
                alert,
                note
            }
        });

        res.status(201).json({
            msg: 'Alerta enviada de manera satisfactoria'
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error al procesar la solicitud'
        });
    }
};

const alertsDelete = async (req: any, res = response) => {
    const id = req.params.id;

    try {
        //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
        const alert = await prisma.alerts.update({ where: { uid: id }, data: { status: false } });

        res.status(201).json({ alert });
    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error al procesar la solicitud'
        });
    }

};

export {
    alertsPost,
    alertsDelete
}