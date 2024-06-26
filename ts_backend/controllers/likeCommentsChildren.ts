import { response, query } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const likeCommentsChildrenGet = async (req: any, res = response) => {
    const id = req.params.id;
    const { page } = req.query;
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = 200;

        try {

            // Obtencion total imagenes
            const totalDocs = await prisma.likeCommentsChildren.count({
                where: {
                    status: true, 
                    uidComments: id
                },
            });

            // calculo total paginas
            const totalPages = Math.ceil(totalDocs / pageSize);

            const docs = await prisma.likeCommentsChildren.findMany({
                where: {
                    status: true,
                    uidComments: id
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
            console.error('Error fetching likeCommentChildren:', error);
            res.status(500).json({ error: 'Internal server error' });
        }

    };

    const likeCommentsChildrenPost = async (req: any, res = response) => {

        const uid = await req.userAuth;
        const { like } = req.body;
        const id = req.params.id;
        if (!like) {
            return res.status(401).json({
                msg: 'Necesita enviar una interaccion'
            })
        }

        const likesCommentsChildren = await prisma.likeCommentsChildren.create({
            data: {
                user: uid.uid,
                uidComments: id,
                like
            }
        })

        res.status(201).json(likesCommentsChildren);
    };

    const likeCommentsChildrenDelete = async (req: any, res = response) => {
        const id = req.params.id;
        //Borrar comentario permanentemente

        //Se modifica el status en false para mapearlo como eliminado sin afectar la integridad
        const likesCommentsChildren = await prisma.likeCommentsChildren.update({ where: { uid: id }, data: { status: false } });

        res.status(201).json({ likesCommentsChildren });
    };

    export {
        likeCommentsChildrenGet,
        likeCommentsChildrenPost,
        likeCommentsChildrenDelete
    }