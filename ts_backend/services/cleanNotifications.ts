import { CronJob } from 'cron';
import dbConnection from '../database/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Definición del job para ejecutar una vez al día a medianoche
const job = new CronJob('0 0 * * *', async () => {
  try {
    await dbConnection();

    // Obtener usuarios únicos que tienen notificaciones
    const uniqueUsers = await prisma.notifications.findMany({
      distinct: ['userOwner'],
      select: { userOwner: true },
    });

    for (const { userOwner } of uniqueUsers) {
      // Obtener notificaciones del usuario, ordenadas por fecha de carga
      const userNotifications = await prisma.notifications.findMany({
        where: { userOwner },
        orderBy: { charged: 'desc' },
      });

      // Elimina los registros que excedan el límite de 15 por usuario
      if (userNotifications.length > 15) {
        const notificationsToDelete = userNotifications.slice(15);
        for (const notification of notificationsToDelete) {
          await prisma.notifications.delete({
            where: { uid: notification.uid },
          });
        }
      }
    }

  } catch (error) {
    console.error('Error al ejecutar la tarea de limpieza de notificaciones:', error);
  }
});

export default job;