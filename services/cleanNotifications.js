const cron = require('node-cron');
const { Notifications } = require('../models/index');
const { dbContection } = require('../database/config');

require('dotenv').config();

// definicion de job uan vez al dia a media noche
cron.schedule('0 0 * * *', async () => {

  try {
    await dbContection();

    const uniqueUsers = await Notifications.distinct('userOwner');

    for (const user of uniqueUsers) {
      const userNotifications = await Notifications.find({ userOwner: user }).sort({ charged: -1 });

      // Elimina los registros que excedan el límite de 15 por usuario
      if (userNotifications.length > 15) {
        const notificationsToDelete = userNotifications.slice(15);
        for (const notification of notificationsToDelete) {
          if (notification.userOwner.toString() === user.toString()) {
            await Notifications.findByIdAndDelete(notification._id);
          }
        }
      }
    }

  } catch (error) {
    console.error('Error al ejecutar la tarea de limpieza de notificaciones:', error);
  }
});