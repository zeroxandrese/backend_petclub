import { response, query } from 'express';
import { PrismaClient } from '@prisma/client';

interface AuthenticatedRequest extends Request {
    userAuth?: {
        _id: string;
    }
}

const prisma = new PrismaClient();


const commentsChildrenGet = async (req: any, res = response) => {
    const id = req.params.id;
    const { page } = req.query;
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = 500;

    try {
        // Obtencion total imagenes
        const totalDocs = await prisma.commentsChildren.count({
            where: {
                status: true,
                uidCommentsFather: id
            },
        });

        // calculo total paginas
        const totalPages = Math.ceil(totalDocs / pageSize);

        const docs = await prisma.commentsChildren.findMany({
            where: {
                status: true,
                uidCommentsFather: id
            },
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
        });

        // calculos para la paginacion
        const pagingCounter = (pageNumber - 1) * pageSize + 1;
        const hasPrevPage = pageNumber > 1;
        const hasNextPage = pageNumber < totalPages;
        const prevPage = hasPrevPage ? pageNumber - 1 : null;
        const nextPage = hasNextPage ? pageNumber + 1 : null;



        res.status(201).json({
            docs,
            totalDocs,
            limit: pageSize,
            totalPages,
            page: pageNumber,
            pagingCounter,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
        });

    } catch (error) {
        console.error('Error fetching CommentsChildren:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const commentsChildrenPut = async (req: any, res = response) => {

    const id = req.params.id;
    const { comments } = req.body;
    try {
        const comment = await prisma.commentsChildren.update({
            where: { uid: id },
            data: { comments }
        });

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const commentsChildrenPost = async (req: any, res = response) => {

    const uid = await req.userAuth;
    const { comments } = req.body;
    const id = req.params.id;
    try {

        if (!comments) {
            return res.status(401).json({
                msg: 'Necesita cargar un comentario'
            })
        }

        const commentChildren = await prisma.commentsChildren.create({
            data: {
                user: uid.uid,
                uidCommentsFather: id,
                comments
            }
        });

        res.status(201).json(commentChildren);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const commentsChildrenDelete = async (req: any, res = response) => {
    const id = req.params.id;
    //Borrar comentario permanentemente
    //const comments = await Comments.findByIdAndDelete( id );

    //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
    const commentChildren = await prisma.commentsChildren.update({ where: { uid: id }, data: { status: false } });

    res.status(201).json({ commentChildren });
};

export {
    commentsChildrenGet,
    commentsChildrenPut,
    commentsChildrenPost,
    commentsChildrenDelete
}