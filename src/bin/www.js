import {createServer} from '../lib/server';
import {env} from '../lib/env';
import {logger} from '../lib/logger';
import mongoose from 'mongoose';
// import socket from 'socket.io'

run();

async function run() {
  try {
    const app = await createServer();
    /*
    const io = socket(app);
    const chatNamespace = io.of('/chat');
    app.chat = chatNamespace;

    chatNamespace.on('connection', function(socket){
      console.log('someone connected');

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
    */

/*
    io.on('join', function* () {
      console.log('join event received, new user: ', this.data);

      // use global io send broad cast
      io.emit('msg', '[All]: ' + this.data + ' joind');

      // use current socket send a broadcast
      this.socket.broadcast('msg', '[All]: Hello guys, I\'m ' + this.data + '.');

      // just send to current user
      this.socket.emit('msg', '[' + this.data + ']' + " Welcome to koa-socket.io !");
    });
*/
    mongoose.Promise = Promise;
    await mongoose.connect(env.MONGO_SERVER, {useMongoClient: true});

    app.listen(env.PORT);

    logger.debug(`Server listening on ${env.PORT} in ${env.NODE_ENV} mode`);
  } catch (err) {
    logger.error('Error while starting up server', err);
    process.exit(1);
  }
}
