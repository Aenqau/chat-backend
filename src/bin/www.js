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

        io.on('connection', function (socket) {
            socket.on('message', function (data) {
                io.sockets.emit('messagePosted', data);
            });
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
