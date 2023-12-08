const { Notifications } = require('../models/index');
const { Socket } = require('socket.io');
const { verifyToken } = require('../helpers/generate-jwt');

const { UserConnect } = require('../models/index');

const socketController = async (socket = new Socket()) => {

  const usuario = await verifyToken(socket.handshake.headers['z-token']);
  if (!usuario) {
    return socket.disconnect();
  }

  const data = {
    user: usuario._id
  }

  const userConnect = new UserConnect(data);

  await userConnect.save();

  socket.emit('prueba', 'Hola desde el servidor');

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

  socket.on('disconnect', async () => {
    console.log(`Se desconectó ${usuario.nombre} con el socket ID: ${socket.id}`);
    const { uid } = await UserConnect.findOne(usuario._id);
    await UserConnect.findByIdAndDelete(uid);
  });

};

module.exports = {
  socketController
};

