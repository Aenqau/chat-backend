import socket from 'socket.io'

export async function socketProcess(ctx, next) {
  console.log('creating io');
  const app = ctx.app;
  console.log('creating io');
  const io = socket(app);
  console.log(io);
  const chatNamespace = io.of('/chat');
  app.chat = chatNamespace;

  chatNamespace.on('connection', function(socket){
    console.log('fired middleware socket');

    socket.on('join', function (data) {
      socket.join(data.chatId);
    });

    socket.on('leave', function () {
      socket.leave(socket.room);
    });

    socket.on('typing', function (data) {
      io.sockets.in(socket.room).emit('userIsTyping', data);
    });

    socket.on('messagePost', function (data) {
      io.sockets.in(socket.room).emit('messagePosted', data);
    });

    socket.on('messageChanged', function (data) {
      io.sockets.in(socket.room).emit('messageChanged', data);
    });

    socket.on('messageDeleted', function (data) {
      io.sockets.in(socket.room).emit('messageChanged', data);
    });

    socket.on('disconnect', function(){ });
  });

  return next();
}