import { response, query } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const likeCommentsGet = async (req: any, res = response) => {
    const id = req.params.id;
    const { page } = req.query;
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = 100;

    try {
        const likeComments = await prisma.likeComments.findMany({
            where: {
                uidComments: id,
                status: true,
            },
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
        });

        res.status(201).json(likeComments);
    } catch (error) {
        console.error('Error fetching likeComments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};

const likeCommentsPost = async (req: any, res = response) => {

    const uid = await req.userAuth;
    const { like } = req.body;
    const id = req.params.id;
    if (!like) {
        return res.status(401).json({
            msg: 'Necesita enviar una interaccion'
        })
    }

    const likesComments = await prisma.likeComments.create({
        data: {
            user: uid.uid,
            uidComments: id,
            like
        }
    });

    res.status(201).json(likesComments);
};

const likeCommentsDelete = async (req: any, res = response) => {
    const id = req.params.id;
    //Borrar comentario permanentemente
    //const comments = await Comments.findByIdAndDelete( id );

    //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
    const likesComments = await prisma.likeComments.update({ where: { uid: id }, data: { status: false } });

    res.status(201).json({ likesComments });
};

export {
    likeCommentsGet,
    likeCommentsPost,
    likeCommentsDelete
}