import Message from '../models/message';
import HttpStatus from 'http-status-codes';
import { controller, get, post, put, del } from 'koa-dec-router';
import BaseCtrl from './Base';

@controller('/messages')

export default class MessagesCtrl extends BaseCtrl {
    @get('/:_id')
    async getMessages(ctx) {
        try {
            const messages = await Message.find({
                userId: ctx.params._id
            }, '-password');
            ctx.ok(messages);
        } catch (err) {
            ctx.throw(HttpStatus.BAD_REQUEST, err.message);
        }
    }

    @post('')
    async createMessage(ctx) {
        const message = new Message(ctx.request.body);
        try {
            await message.save();
        } catch (err) {
            ctx.throw(422, err.message);
        }

        ctx.body = {
            message: message
        }
    }

    @put('/:_id')
    async updateMessage (ctx) {
        const message = ctx.body.message;

        Object.assign(message, ctx.request.body.message);

        await message.save();

        ctx.body = {
            message
        }
    }

    @del('/:_id')
    async deleteMessage (ctx) {
        const message = ctx.body.message;

        await message.remove();

        ctx.status = 200;
        ctx.body = {
            success: true
        }
    }
}
