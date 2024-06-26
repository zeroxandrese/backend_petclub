import { request, response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tasksGet = async (req = request, res = response) => {

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

export default tasksGet;