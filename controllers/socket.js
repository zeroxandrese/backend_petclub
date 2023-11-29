

const socketController = (socket) => {
    console.log('socket conectado');

  socket.on('enviar-uid', ({uid})=>{
    console.log('paso por aqui', uid);
  });

  socket.on('recibir-comments', ({ uid, nombre, uidDestino, imgUid }) => {
    console.log('recibí en el servidor esto:', uid, nombre, uidDestino, imgUid);
    console.log('este es el uid:', uid);
    if (uidDestino) {
      socket.join(uidDestino);
      console.log(`Socket unido a la sala con UID: ${uidDestino}`);
      socket.to(uidDestino).emit('mensaje-privado', uid);
      
    }
  });

  socket.on('disconnect', () => {
    console.log('cliente desconectado');
  });
};

module.exports = {
  socketController
};

