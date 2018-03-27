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
      console.log('someone connected');

      socket.on('join', function (data) {
        socket.join(data.chatId);
        socket.to(socket.rooms).emit('joined', 'joined room!');
        console.log('joined room');
        console.log(socket.rooms);
      });

      socket.on('leave', function () {
        socket.leave(socket.rooms);
      });

      socket.on('typing', function (data) {
        io.sockets.in(socket.rooms).emit('userIsTyping', data);
      });

      socket.on('messagePost', function (data) {
          console.log('message has been posted');
          socket.manager.sockets.in(socket.rooms[0]).emit('messagePosted', data);
      });

      socket.on('messageChanged', function (data) {
          io.sockets.in(socket.rooms).emit('messageChanged', data);
      });

      socket.on('messageDeleted', function (data) {
        console.log('message has been deleted');
          socket.broadcast.to(socket.rooms).emit('messageDelete', data);
        //io.sockets.in(socket.rooms).emit('messageDelete', data);
      });

      socket.on('disconnect', function(){ });
    });


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
