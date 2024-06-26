import { response, query } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const likeGet = async (req: any, res = response) => {
    const id = req.params.id;
    const { page } = req.query;
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = 100;

    try {
        // Obtencion total imagenes
        const totalDocs = await prisma.like.count({
            where: {
                status: true,
                uidImg: id
            },
        });

        // calculo total paginas
        const totalPages = Math.ceil(totalDocs / pageSize);

        const docs = await prisma.like.findMany({
            where: {
                status: true,
                uidImg: id
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
        console.error('Error fetching like:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};

const likePost = async (req: any, res = response) => {

    const uid = await req.userAuth;
    const { like } = req.body;
    const id = req.params.id;

    try {
        if (!like) {
            return res.status(401).json({
                msg: 'Necesita enviar una interaccion'
            })
        }

        const likes = await prisma.like.create({
            data: {
                user: uid.uid,
                uidImg: id,
                like
            }
        });


        const idResult = await prisma.pawsCount.findFirst({
            where: { user: uid.uid }
        });

        if (!idResult) {

            await prisma.pawsCount.create({
                data: {
                    user: uid.uid,
                    paws: 1,
                    lastUpdate: new Date()
                }
            });

        } else {
            if (idResult.paws !== null) {
                await prisma.pawsCount.update({ where: { uid: idResult.uid }, data: { paws: idResult.paws + 1, lastUpdate: new Date() } });
            }
        }

        const idResultPoint = await prisma.tokenPoint.findFirst({ where: { user: uid.uid } });

        if (!idResultPoint) {

            await prisma.tokenPoint.create({
                data: {
                    user: uid.uid,
                    points: 5,
                    lastUpdate: new Date()
                }
            });
        } else {
            if (idResultPoint.points !== null) {
                await prisma.tokenPoint.update({
                    where: { uid: idResultPoint.uid }, data: { points: idResultPoint.points + 5, lastUpdate: new Date() }
                });
            }
        }

        const idResultImage = await prisma.image.findFirst({ where: { uid: id } });

        if (idResultImage) {
            await prisma.countLikes.create({
                data: {
                    user: idResultImage?.user,
                    userSender: uid.uid,
                    like: 1,
                    created: new Date()
                }
            });
        }

        res.status(201).json(likes);
    } catch (error) {
        console.error('Error fetching CommentsChildren:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const likeDelete = async (req: any, res = response) => {
    const id = req.params.id;
    //Borrar comentario permanentemente
    //const comments = await Comments.findByIdAndDelete( id );

    //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
    const likes = await prisma.like.update({ where: { uid: id }, data: { status: false } });

    res.status(201).json({ likes });
};

export {
    likeGet,
    likePost,
    likeDelete
}