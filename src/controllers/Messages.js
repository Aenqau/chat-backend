import Message from '../models/message';
import ChatRoom from '../models/chatroom';
import HttpStatus from 'http-status-codes';
import { controller, get, post, put, del } from 'koa-dec-router';
//  import verifyToken from '../middleware/jwt';
import socketProcess from '../middleware/socket';
import BaseCtrl from './Base';

//  @controller('/messages', verifyToken())
@controller('/messages', socketProcess())

export default class MessagesCtrl extends BaseCtrl {
    //  localhost:5006/api/messages/5aa13d7f4e3bca3a382de894
    @get('/:_id')
    async getMessages(ctx) {
        try {
            //  check if given chatroom exist, and have current user in it
            await ChatRoom.find({
                _id : ctx.params._id,
                users : { $in : [{_id: process.env.USER_ID}] }
            });

            const messages = await Message.find({
                chat : ctx.params._id,
            });

            ctx.body = {
                messages: messages
            }
        } catch (err) {
            ctx.status = 404;
            ctx.body = {
                status: ctx.params._id
            }
        }
    }

    @post('/:_id')
    async createMessage(ctx) {
        try {
            await ChatRoom.find({
              users : { $in : [{_id: ctx.params._id}] }
            });
            const message = new Message({
                chat: ctx.request.body.chat,
                body: ctx.request.body.body
            });
            try {
                await message.save();
            } catch (err) {
                ctx.throw(HttpStatus.BAD_REQUEST, err.message);
            }
            ctx.body = message;
        } catch (err) {
            ctx.status = 403;
            ctx.body = {
                error: err
            }
        }
    }

    @put('/:_id')
    async updateMessage (ctx) {
        //  TODO: check if user have a permission
        const message = ctx.body.message;

        Object.assign(message, ctx.request.body.message);

        await message.save();

        ctx.body = {
            message
        }
    }

    @del('/:_id')
    async deleteMessage (ctx) {
      try {
        await ChatRoom.find({
          users : { $in : [{_id: process.env.USER_ID}] }
        });

        try {
          await Message.find().and([
            { author : process.env.USER_ID },
            { _id : ctx.params._id }
          ]);
          console.log(ctx.app);
          ctx.app.chat.sockets.emit('messageDeleted', true);
        } catch (err) {
          ctx.throw(HttpStatus.BAD_REQUEST, err.message);
        }
        ctx.body = 'message found';
      } catch (err) {
        ctx.status = 403;
        ctx.body = {
          error: err
        }
      }

    }
}
