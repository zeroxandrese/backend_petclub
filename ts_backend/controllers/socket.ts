import { verifyToken } from '../helpers/generate-jwt';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const socketController = async (socket: any) => {

  const usuario = await verifyToken(socket.handshake.headers['z-token']);
  if (!usuario) {
    return socket.disconnect();
  }

  const userValidationConnected = await prisma.userConnect.findFirst({
    where: { uid: usuario._id }
  });

  if (userValidationConnected) {
    await prisma.userConnect.delete({
      where: { uid: userValidationConnected.uid }
    })
  }

  await prisma.userConnect.create({ data: { user: usuario._id } });

  socket.join(usuario._id.toString());

  socket.on('notifications-comments', async ({ imgUid }: any) => {
    if (imgUid) {
      try {
        const userValidation = await prisma.image.findFirst({
          where: { uid: imgUid }
        });

        if (userValidation!.user !== usuario.uid) {

          await prisma.notifications.create({
            data: {
              userOwner: usuario._id,
              uidImg: userValidation!.uid,
              userSender: userValidation!.user,
              event: "COMMENTS"
            }
          });

          if (userValidation) {
            socket.to(userValidation.user.toString()).emit('notificationComments', { de: usuario.nombre, userValidation });
          }
        }

      } catch (error) {
        console.error('Error al desconectar el socket:', error);
      }
    }
  });

  socket.on('notifications-likes', async ({ imgUid }: any) => {
    if (imgUid) {
      try {
        const userValidation = await prisma.image.findFirst({
          where: { uid: imgUid }
        });

        if (userValidation!.user !== usuario._id) {

          await prisma.notifications.create({
            data: {
              userOwner: usuario._id,
              uidImg: userValidation!.uid,
              userSender: userValidation!.user,
              event: "LIKES"
            }
          });

          if (userValidation) {
            socket.to(userValidation.user.toString()).emit('notificationLikes', { de: usuario.nombre, userValidation });
          }
        }
      } catch (error) {
        console.error('Error al desconectar el socket:', error);
      }
    }
  });

  socket.on('disconnect', async () => {
    console.log(`Se desconectó ${usuario.nombre} con el socket ID: ${socket.id}`);
    if (usuario._id) {
      try {
        const userConnect = await prisma.userConnect.findFirst({
          where: { uid: usuario._id }
        });

        if (userConnect) {
          const { uid } = userConnect;
          await prisma.userConnect.delete({
            where: { uid: uid }
          })
        }
      } catch (error) {
        console.error('Error al desconectar el socket:', error);
      }
    }
  });

};

export default socketController;

