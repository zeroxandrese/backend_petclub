import { response, query } from 'express';
import { PrismaClient } from '@prisma/client';

interface AuthenticatedRequest extends Request {
    userAuth?: {
        uid: string;
    }
}

const prisma = new PrismaClient();

const commentsGet = async (req: any, res = response) => {
    const id = req.params.id;
    const { page } = req.query;
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = 500;

    try {
        // Obtencion total comments
        const totalDocs = await prisma.comments.count({
            where: {
                status: true,
                uidImg: id
            },
        });

        // calculo total paginas
        const totalPages = Math.ceil(totalDocs / pageSize);

        const docs = await prisma.comments.findMany({
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
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const commentsGetPaginate = async (req: any, res = response) => {
    const id = req.params.id;
    const { page } = req.query;
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = 15;

    try {
        // Obtencion total comments
        const totalDocs = await prisma.comments.count({
            where: {
                status: true,
                uidImg: id
            },
        });

        // calculo total paginas
        const totalPages = Math.ceil(totalDocs / pageSize);

        const docs = await prisma.comments.findMany({
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
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const twoCommentsGet = async (req: any, res = response) => {
    const id = req.params.id;
    const { page } = req.query;
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = 2;

    try {
        // Obtencion total comments
        const totalDocs = await prisma.comments.count({
            where: {
                status: true,
                uidImg: id
            },
        });

        // calculo total paginas
        const totalPages = Math.ceil(totalDocs / pageSize);

        const docs = await prisma.comments.findMany({
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
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const commentsPut = async (req: any, res = response) => {

    const id = req.params.id;
    const { comments } = req.body;

    const comment = await prisma.comments.update({
        where: { uid: id },
        data: { comments }
    });

    res.status(201).json(comment);
};

const commentsPost = async (req: any, res = response) => {

    const uid = await req.userAuth;
    const { comments } = req.body;
    const id = req.params.id;

    try {
        if (!comments) {
            return res.status(401).json({
                msg: 'Necesita cargar un comentario'
            })
        };

        const comment = await prisma.comments.create({
            data: {
                user: uid.uid,
                uidImg: id,
                comments
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
                    points: 10,
                    lastUpdate: new Date()
                }
            });
        } else {
            if (idResultPoint.points !== null) {
                await prisma.tokenPoint.update({
                    where: { uid: idResultPoint.uid }, data: { points: idResultPoint.points + 10, lastUpdate: new Date() }
                });
            }
        }

        const idResultCountComments = await prisma.countComments.findFirst({
            where:
              { user: uid.uid }
          });
    
          if (!idResultCountComments) {
              await prisma.countComments.create({
                  data: {
                      user: uid.uid,
                      comments: 1,
                      lastUpdate: new Date()
                  }
              });
          }else {
            if (idResultCountComments.comments !== null) {
              await prisma.countComments.update({ where: { uid: idResultCountComments.uid }, data: { comments: idResultCountComments.comments + 1, lastUpdate: new Date() } })
            }
          }

        res.status(201).json(comment);
    } catch (error) {
        console.error('Error fetching Comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};

const commentsDelete = async (req: any, res = response) => {
    const id = req.params.id;
    //Borrar comentario permanentemente
    //const comments = await Comments.findByIdAndDelete( id );

    //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
    const comment = await prisma.comments.update({
        where: { uid: id },
        data: { status: false }
    });

    res.status(201).json({ comment });
};

export {
    commentsGet,
    commentsPut,
    commentsPost,
    commentsDelete,
    twoCommentsGet,
    commentsGetPaginate
}