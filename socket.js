module.exports = (io) => {
  io.on('connection', (socket) => {
    const { userId } = socket.handshake.query;
    socket.join(userId);

    socket.on('disconnect', () => {
      socket.leave(userId);
    });
  });
};