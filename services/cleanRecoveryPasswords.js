const cron = require('node-cron');
const { RecoveryPassword } = require('../models/index');
const { dbContection } = require('../database/config');

require('dotenv').config();

// definicion de job cada minuto
cron.schedule('0 */2 * * *', async () => {

  try {
    await dbContection();
    
    const cutoffTime = new Date(Date.now() - 4 * 60 * 1000);

    // Actualizacion de status de los registros cuya fecha de creación sea mayor a 4 minutos
   const result = await RecoveryPassword.updateMany(
      { charged: { $lte: cutoffTime } },
      { $set: { status: false } },
      { maxTimeMS: 60000 }
    );

  } catch (error) {
    console.error('Error al actualizar registros:', error);
  }
});