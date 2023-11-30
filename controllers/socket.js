

const socketController = (socket) => {
    console.log('socket conectado');

  socket.on('enviar-uid', ({uid})=>{
    console.log('paso por aqui', uid);
  });

  socket.on('recibir-comments', ({ uid, nombre, uidDestino, imgUid }) => {
    console.log('recibí en el servidor esto:', uid, nombre, uidDestino, imgUid);
    console.log('este es el uid:', uidDestino);
    if (uidDestino) {
      console.log('ID del socket conectado:', socket.id);
      socket.to(socket.id).emit('mensaje-privado', uid);
      
    }
  });

  socket.on('disconnect', () => {
    console.log('cliente desconectado');
  });
};

module.exports = {
  socketController
};

