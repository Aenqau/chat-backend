import {createServer} from '../lib/server';
import {env} from '../lib/env';
import {logger} from '../lib/logger';
import mongoose from 'mongoose';
import socket from 'socket.io'

run();

async function run() {
  try {
    const app = await createServer();
    const io = socket(app);
  /*  const chatNamespace = io.of('/chat');
    app.chat = chatNamespace;
*/
    io.on('connection', function(socket){
      socket.on('join', function (room) {
        socket.join(room);
        socket.in(room).emit('joined', 'joined room!');
      });

      socket.on('leave', function () {
        socket.leave(socket.rooms);
      });

      socket.on('typing', function (data) {
        io.sockets.in(socket.rooms).emit('userIsTyping', data);
      });

      socket.on('messagePosted', function (data) {
          io.sockets.in(data.room).emit('messagePosted', data.message);
      });

      socket.on('messageChanged', function (data) {
          io.sockets.in(socket.rooms).emit('messageChanged', data);
      });

      socket.on('messageDeleted', function (data) {
        io.sockets.in(data.room).emit('messageDeleted', data.messageId);
      });

      socket.on('disconnect', function(){ });
    });

    mongoose.Promise = Promise;
    await mongoose.connect(env.MONGO_SERVER, {useMongoClient: true});

    app.listen(env.PORT);

    logger.debug(`Server listening on ${env.PORT} in ${env.NODE_ENV} mode`);
  } catch (err) {
    logger.error('Error while starting up server', err);
    process.exit(1);
  }
}
