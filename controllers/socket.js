const { Notifications } = require('../models/index');

const socketController = (socket) => {
  console.log('socket conectado');
  console.log(socket);

  socket.on('enviar-uid', ({ uid }) => {
    console.log('paso por aqui', uid);
  });

  socket.on('recibir-comments', async ({ userOwner, imgUid, userSender, event }) => {
    socket.emit('prueba', 'Hola desde el servidor');
/*     if (userOwner && imgUid && userSender && event) {
      try {
        const data = {
          userOwner,
          imgUid,
          userSender,
          event: "NOTIFICATIONS"
        };
        const notifications = new Notifications(data);
        await notifications.save();

        res.status(201).json(notifications);
      } catch (error) {
        res.status(500).json({
          msg: 'Algo salio mal, contacte con el administrador'
        })
      }
    } */
  });

  socket.on('disconnect', () => {
    console.log('cliente desconectado');
  });
};

module.exports = {
  socketController
};

