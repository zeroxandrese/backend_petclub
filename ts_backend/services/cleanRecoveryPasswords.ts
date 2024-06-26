import { CronJob } from 'cron';
import dbConnection from '../database/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const job = new CronJob('0 */2 * * *', async () => {
  try {
      await dbConnection();

      const cutoffTime = new Date(Date.now() - 4 * 60 * 1000);

      // Actualización de los registros
      const updatedRecords = await prisma.recoveryPassword.updateMany({
          where: {
              charged: { lte: cutoffTime }
          },
          data: {
              status: false
          }
      });

      console.log(`Se actualizaron ${updatedRecords.count} registros`);

  } catch (error) {
      console.error('Error al actualizar registros:', error);
  }
});

export default job;