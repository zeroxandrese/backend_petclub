const { Socket } = require('socket.io');
const { verifyToken } = require('../helpers/generate-jwt');

const { UserConnect, Image, Notifications } = require('../models/index');

const socketController = async (socket = new Socket()) => {

  const usuario = await verifyToken(socket.handshake.headers['z-token']);
  if (!usuario) {
    return socket.disconnect();
  }

  const userValidationConnected = await UserConnect.findOne(usuario._id);
  if (userValidationConnected) {
    await UserConnect.findByIdAndDelete(userValidationConnected._id);
  }

  const data = {
    user: usuario._id
  }

  const userConnect = new UserConnect(data);
  await userConnect.save();
  socket.join(usuario._id.toString());
  console.log('_id del usuario luego del join',usuario._id.toString());
  console.log('_id del usuario luego del join pero el typo',typeof(usuario._id.toString()));

  socket.on('notifications-comments', async ({ imgUid }) => {
    if (imgUid) {
      try {
        const userValidation = await Image.findById(imgUid)
        const data = {
          userOwner: usuario._id,
          uidImg: userValidation._id,
          userSender: userValidation.user,
          event: "COMMENTS"
        };
        const notifications = new Notifications(data);
        await notifications.save();

        socket.to(userValidation.user.toString()).emit('mensaje-privado', { de: usuario.nombre });
        socket.emit('mensaje-prueba', { de: usuario.nombre, uid: usuario._id  });
        console.log('uid del usuario dentro ya',userValidation.user.toString());
        console.log('uid del usuario dentro ya pero el typo',typeof(userValidation.user.toString()));

      } catch (error) {
        console.error('Error al desconectar el socket:', error);
      }
    }
  });

  socket.on('disconnect', async () => {
    console.log(`Se desconectó ${usuario.nombre} con el socket ID: ${socket.id}`);
    if (usuario._id) {
      try {
        const userConnect = await UserConnect.findOne(usuario._id);
        if (userConnect) {
          const { _id } = userConnect;
          await UserConnect.findByIdAndDelete(_id);
        }
      } catch (error) {
        console.error('Error al desconectar el socket:', error);
      }
    }
  });

};

module.exports = {
  socketController
};

