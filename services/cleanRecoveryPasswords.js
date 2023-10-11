const cron = require('node-cron');
const { RecoveryPassword } = require('../models/index');
const { dbContection } = require('../database/config');

require('dotenv').config();

// Definir una tarea cron para ejecutar cada minuto (ajusta la programación según tus necesidades)
cron.schedule('* * * * *', async () => {

  try {
    await dbContection();
    
    const cutoffTime = new Date(Date.now() - 5 * 60 * 1000); // Obtener la hora actual - 5 minutos

    // Actualizacion de status de los registros cuya fecha de creación sea mayor a 5 minutos
   const result = await RecoveryPassword.updateMany(
      { charged: { $lte: cutoffTime } },
      { $set: { status: false } },
      { maxTimeMS: 60000 }
    );

  } catch (error) {
    console.error('Error al actualizar registros:', error);
  }
});