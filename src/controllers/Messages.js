import Message from '../models/message';
import HttpStatus from 'http-status-codes';
import { controller, get, post, put, del } from 'koa-dec-router';
import BaseCtrl from './Base';

@controller('/messages')
export default class MessagesCtrl extends BaseCtrl {
    @get('')
    async getMessages(ctx) {
        try {
            const messages = await Message.find({}, '-password');
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

    @get('/:_id')
    async getMessage (ctx, next) {
        try {
            const message = await Message.findById(ctx.params.id);
            if (!message) {
                ctx.throw(404)
            }

            ctx.body = {
                message
            }
        } catch (err) {
            if (err === 404 || err.name === 'CastError') {
                ctx.throw(404)
            }

            ctx.throw(500)
        }

        if (next) { return next() }
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
    async deleteUser (ctx) {
        const message = ctx.body.message;

        await message.remove();

        ctx.status = 200;
        ctx.body = {
            success: true
        }
    }
}
