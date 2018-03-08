import Message from '../models/message';
import ChatRoom from '../models/chatroom';
import HttpStatus from 'http-status-codes';
import { controller, post, put, del } from 'koa-dec-router';
import BaseCtrl from './Base';

@controller('/messages')

export default class MessagesCtrl extends BaseCtrl {

    @post('')
    async createMessage(ctx) {
        //  check token identity
        if (ctx.request.body.token === process.env.TOKEN) {
            //  check if user exists in that chat
            try {
                await ChatRoom.find({
                    users : { $in : [{_id: process.env.USER_ID}] }
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

                ctx.body = {
                    success: true
                }
            } catch (err) {
                ctx.status = 403;
                ctx.body = {
                    success: false
                }
            }
        }
        else {
            ctx.status = 401;
            ctx.body = {
                success: false
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
        //  TODO: check if user have a permission
        const message = ctx.body.message;

        await message.remove();

        ctx.status = 200;
        ctx.body = {
            success: true
        }
    }
}
