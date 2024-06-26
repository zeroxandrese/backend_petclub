import { CronJob } from 'cron';
import dbConnection from '../database/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const job = new CronJob('0 0 * * *', async () => {
    try {
        await dbConnection();

        // Obtener registros de pawscounts
        const pawsCounts = await prisma.pawsCount.findMany({
            where: {
                status: true
            },
            orderBy: {
                paws: 'desc'
            }
        });

        // Eliminar registros de la tabla ranking
        await prisma.ranking.deleteMany({
            where: {
                status: true
            }
        });

        // Insertar los registros ordenados en la tabla ranking con posición
        const rankingRecords = pawsCounts.map((pawsCount, index) => ({
            user: pawsCount.user,
            position: index + 1,
            status: true,
            created: new Date()
        }));

        await prisma.ranking.createMany({
            data: rankingRecords
        });

        console.log('Se actualizó la tabla ranking');

    } catch (error) {
        console.error('Error en el proceso de actualización del ranking:', error);
    } finally {
        await prisma.$disconnect();
    }
});

export default job;