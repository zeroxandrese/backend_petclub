const { Notifications } = require('../models/index');
const { Socket } = require('socket.io');
const { verifyToken } = require('../helpers/generate-jwt');

const { UserConnect, Image } = require('../models/index');

const socketController = async (socket = new Socket()) => {

  const usuario = await verifyToken(socket.handshake.headers['z-token']);
  if (!usuario) {
    return socket.disconnect();
  }

  const { _id } = await UserConnect.findOne(usuario._id);
  if (_id) {
    await UserConnect.findByIdAndDelete(_id);
  }
  
  const data = {
    user: usuario._id
  }

  const userConnect = new UserConnect(data);

  await userConnect.save();

  socket.on('notifications-comments', async ({ imgUid }) => {
    socket.emit('prueba', 'Hola desde el servidor');
    if (imgUid) {
      try {
        const { user } = await Image.findById(imgUid)
        const data = {
          userOwner: usuario._id,
          imgUid,
          userSender: user._id,
          event: "COMMENTS"
        };
        const notifications = new Notifications(data);
        await notifications.save();

      } catch (error) {
        res.status(500).json({
          msg: 'Algo salio mal, contacte con el administrador'
        })
      }
    }
  });

  socket.on('disconnect', async () => {
    console.log(`Se desconectó ${usuario.nombre} con el socket ID: ${socket.id}`);
    const { _id } = await UserConnect.findOne(usuario._id);
    await UserConnect.findByIdAndDelete(_id);
  });

};

module.exports = {
  socketController
};

