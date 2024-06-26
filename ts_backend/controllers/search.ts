import { response, query, request } from 'express';

import { Schema, Types } from 'mongoose';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const collectionPermitidas = [
    'emails',
    'pais',
    'roles',
    'sexos',
    'petsImg',
    'pets',
    'users',
    'images',
    'imagesItem',
    'petsalluser',
    'notifications',
    'pawsCount',
    'likesCount',
    'videosCount',
    'imagesCount',
    'commentsCount',
    //'tasks',
    'tasksByUser',
    'ranking'
]

const searchUsuarios = async (term = '', res = response) => {

    const mongoID = Types.ObjectId.isValid(term);

    if (mongoID) {
        const user = await prisma.user.findUnique({ where: { uid: term } });
        return res.status(201).json({
            results: (user) ? [user] : []
        });
    }

    const user = await prisma.user.findMany({
        where: {
            AND: [
                {
                    OR: [
                        { nombre: { contains: term, mode: 'insensitive' } },
                        { email: { contains: term, mode: 'insensitive' } },
                        { role: { contains: term, mode: 'insensitive' } }
                    ]
                },
                { status: true }
            ]
        }
    });

    res.status(201).json({
        results: user
    });
}

const searchPetsImg = async (term = '', res = response) => {
    try {
        const image = await prisma.image.findMany({
            where: {
                AND: [
                    { pet: term },
                    { status: true }
                ]
            }
        });

        res.status(201).json({
            results: image
        });
    } catch (error) {
        console.error('Error while searching for pet images:', error);
        res.status(500).json({
            msg: 'Algo salió mal, contacte con el administrador'
        });
    }
};

const searchEmailUser = async (term = '', res = response) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                AND: [
                    { email: term },
                    { status: true }
                ]
            }
        });

        res.status(201).json({
            results: user
        });
    } catch (error) {
        console.error('Error while searching for user by email:', error);
        res.status(500).json({
            msg: 'Algo salió mal, contacte con el administrador'
        });
    }
};

const searchPetsAllUser = async (term = '', res = response) => {
    try {
        const pets = await prisma.pet.findMany({
            where: {
                AND: [
                    { user: term },
                    { status: true }
                ]
            }
        });

        res.status(201).json({
            results: pets
        });
    } catch (error) {
        console.error('Error while searching for pets by user:', error);
        res.status(500).json({
            msg: 'Algo salió mal, contacte con el administrador'
        });
    }
};

const searchPet = async (term = '', res = response) => {

    const mongoID = Types.ObjectId.isValid(term);

    if (mongoID) {
        const pet = await prisma.pet.findUnique({ where: { uid: term } });
        return res.status(201).json({
            results: (pet) ? [pet] : []
        });
    }

    const pet = await prisma.pet.findMany({
        where: {
            AND: [
                {
                    OR: [
                        { nombre: { contains: term, mode: 'insensitive' } },
                        { tipo: { contains: term, mode: 'insensitive' } }
                    ]
                },
                { status: true }
            ]
        }
    });

    res.status(201).json({
        results: pet
    });
};

const searchImages = async (term = '', res = response) => {
    try {
        // Use Prisma to search for images by user and status
        const image = await prisma.image.findMany({
            where: {
                AND: [
                    { user: term },
                    { status: true }
                ]
            }
        });

        res.status(201).json({
            results: image
        });
    } catch (error) {
        console.error('Error while searching for images:', error);
        res.status(500).json({
            msg: 'Algo salió mal, contacte con el administrador'
        });
    }
};

const searchImagesItem = async (term = '', res = response) => {
    try {
        // Use Prisma to find an image by ID
        const image = await prisma.image.findUnique({
            where: { uid: term }
        });

        res.status(201).json({
            results: image ? [image] : []
        });
    } catch (error) {
        console.error('Error while searching for image item:', error);
        res.status(500).json({
            msg: 'Algo salió mal, contacte con el administrador'
        });
    }
};

const searchNotifications = async (term = '', res = response) => {
    try {
        const notification = await prisma.notifications.findMany({
            where: {
                OR: [
                    { userSender: term }
                ],
                status: true
            }
        });

        res.status(200).json({
            results: notification
        });
    } catch (error) {
        console.error('Error en búsqueda de notificaciones:', error);
        res.status(500).json({
            msg: 'Error en la búsqueda de notificaciones, contacta al administrador'
        });
    }
};

const searchPawsCount = async (term = '', res = response) => {

    try {
        const pawCount = await prisma.pawsCount.findMany({
            where: {
                OR: [
                    { user: term }
                ],
                status: true
            }
        });

        res.status(200).json({
            results: pawCount
        });
    } catch (error) {
        console.error('Error en búsqueda de pawCount:', error);
        res.status(500).json({
            msg: 'Error en la búsqueda de pawCount, contacta al administrador'
        });
    }

};

const searchLikesCount = async (term = '', res = response) => {

    try {
        const likesCount = await prisma.countLikes.count({
            where: {
                OR: [
                    { user: term }
                ],
                status: true
            }
        });

        const likesCountForMe = await prisma.countLikes.count({
            where: {
                OR: [
                    { userSender: term }
                ],
                status: true
            }
        });

        res.status(201).json({
            results: ({
                likesCount,
                likesCountForMe
            })
        });
    } catch (error) {
        console.error('Error en búsqueda de likesCount:', error);
        res.status(500).json({
            msg: 'Error en la búsqueda de likesCount, contacta al administrador'
        });
    }

};

const searchVideosCount = async (term = '', res = response) => {

    try {
        const countVideos = await prisma.countVideos.findMany({
            where: {
                OR: [
                    { user: term }
                ],
                status: true
            }
        });

        res.status(200).json({
            results: countVideos
        });
    } catch (error) {
        console.error('Error en búsqueda de countVideos:', error);
        res.status(500).json({
            msg: 'Error en la búsqueda de countVideos, contacta al administrador'
        });
    }

};

const searchImagesCount = async (term = '', res = response) => {

    try {
        const countImage = await prisma.countImage.findMany({
            where: {
                OR: [
                    { user: term }
                ],
                status: true
            }
        });

        res.status(200).json({
            results: countImage
        });
    } catch (error) {
        console.error('Error en búsqueda de countImage:', error);
        res.status(500).json({
            msg: 'Error en la búsqueda de countImage, contacta al administrador'
        });
    }

};

const searchCommentsCount = async (term = '', res = response) => {

    try {
        const countComments = await prisma.countComments.findMany({
            where: {
                OR: [
                    { user: term }
                ],
                status: true
            }
        });

        res.status(200).json({
            results: countComments
        });
    } catch (error) {
        console.error('Error en búsqueda de countComments:', error);
        res.status(500).json({
            msg: 'Error en la búsqueda de countComments, contacta al administrador'
        });
    }

};

/* const searchTasks = async (term = '', res = response) => {

    try {
        const tasks = await prisma.tasks.findMany({
            where: {
                status: true
            }
        });

        res.status(201).json({
            results: tasks
        });
    } catch (error) {
        console.error('Error en búsqueda de tasks:', error);
        res.status(500).json({
            msg: 'Error en la búsqueda de tasks, contacta al administrador'
        });
    }

};
 */
const searchTasksByUser = async (term = '', res = response) => {

    try {
        const tasks = await prisma.tasksByUser.findMany({
            where: {
                user: term
            }
        });

        res.status(201).json({
            results: tasks
        });
    } catch (error) {
        console.error('Error en búsqueda de tasksByUser:', error);
        res.status(500).json({
            msg: 'Error en la búsqueda de tasksByUser, contacta al administrador'
        });
    }

};

const searchRanking = async (term = '', res = response) => {
    try {
        const ranking = await prisma.ranking.findMany({
            where: {
                status: true
            },
            orderBy: {
                position: 'asc'
            },
            take: 10
        });

        const myPosition = await prisma.ranking.findMany({
            where: {
                user: term
            }
        });

        res.status(201).json({
            results: ({
                ranking,
                myPosition
            })
        });
    } catch (error) {
        console.error('Error en búsqueda de tasksByUser:', error);
        res.status(500).json({
            msg: 'Error en la búsqueda de tasksByUser, contacta al administrador'
        });
    }
};



const searchGet = async (req: any, res = response) => {

    const { collection, term } = req.params;

    if (!collectionPermitidas.includes(collection)) {
        return res.status(400).json({
            msg: 'La collection no existe'
        });
    }

    switch (collection) {
        case 'emails':
            searchEmailUser(term, res)
            break;
        case 'petsalluser':
            searchPetsAllUser(term, res);
            break;
        case 'pets':
            searchPet(term, res);
            break;
        case 'petsImg':
            searchPetsImg(term, res);
            break;
        case 'images':
            searchImages(term, res);
            break;
        case 'imagesItem':
            searchImagesItem(term, res);
            break;
        case 'users':
            searchUsuarios(term, res);
            break;
        case 'notifications':
            searchNotifications(term, res);
            break;
        case 'pawsCount':
            searchPawsCount(term, res);
            break;
        case 'likesCount':
            searchLikesCount(term, res);
            break;
        case 'videosCount':
            searchVideosCount(term, res);
            break;
        case 'imagesCount':
            searchImagesCount(term, res);
            break;
        case 'commentsCount':
            searchCommentsCount(term, res);
            break;
/*         case 'tasks':
            searchTasks(term, res);
            break; */
        case 'tasksByUser':
            searchTasksByUser(term, res);
            break;
        case 'ranking':
            searchRanking(term, res);
            break;

        default:
            res.status(500).json({
                msg: 'Collection no incluida, Contacta al admin'
            });
    }
};

export default searchGet;