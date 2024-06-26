import { response, query } from 'express';
import { PrismaClient } from '@prisma/client';

interface AuthenticatedRequest extends Request {
    userAuth?: {
        _id: string;
    }
}

const prisma = new PrismaClient();

const commentsAdminPost = async (req: any, res = response) => {

    const uid = await req.userAuth;
    const { comments } = req.body;
    if (!comments) {
        return res.status(401).json({
            msg: 'Necesita cargar un comentario'
        })
    }

    await prisma.commentsAdmin.create({
        data: {
            user: uid.uid,
            comments
        }
    });

    res.status(201).json({
        msg: 'El comentario fue cargado de manera exitosa'
    })
};

export default commentsAdminPost;