import ChatRoom from '../models/chatroom';
import HttpStatus from 'http-status-codes';
import { controller, get, post, put, del } from 'koa-dec-router';
import verifyToken from '../middleware/jwt';
import BaseCtrl from './Base';

//  @controller('/chat', verifyToken())
@controller('/chat')

export default class ChatCtrl extends BaseCtrl {

    //  get list of user's chatrooms
    //  localhost:5002/api/chat/589891235herr
    @get('/:_id')
    async getChatById(ctx) {
        try {
            const chat = await ChatRoom.find({
                users : { $in : [{_id: ctx.params._id}] }
            });
            ctx.ok(chat);
        } catch (err) {
            ctx.status = 403;
            ctx.body = {
                success: false
            }
        }
    }

    @post('')
    async createChat(ctx) {
        try {
            await ChatRoom.find({
                users : { $in : [{_id: process.env.USER_ID}, {_id: ctx.request.body.target}] },
            });
            ctx.status = 400;
            ctx.body = {
                err: 'Chat already exist'
            }
        } catch (err) {
            //  if chat wasn't found, creating new
            const chat = new ChatRoom({
                users: [{_id: process.env.USER_ID}, {_id: ctx.request.body.target}]
            });
            try {
                await chat.save();
            } catch (err) {
                ctx.throw(HttpStatus.BAD_REQUEST, err.message);
            }
            ctx.status = 201;
            ctx.body = {
                success: true
            }
        }
    }

    @put('/:_id')
    async updateChat (ctx) {
        try {
            //  TODO: check if user have a permission
            await ChatRoom.find({
                users : { $in : [{_id: process.env.USER_ID}] }
            });

            const chat = ctx.body.chat;

            Object.assign(chat, ctx.request.body.chat);

            await chat.save();

            ctx.body = {
                chat
            }
        } catch (err) {
            ctx.status = 403;
            ctx.body = {
                success: false
            }
        }
    }

    @del('/:_id')
    async deleteChat (ctx) {
        try {
            //  TODO: check if user have a permission
            await ChatRoom.find({
                users : { $in : [{_id: process.env.USER_ID}] }
            });

            const chat = ctx.body.chat;

            await chat.remove();

            ctx.status = 200;
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
}
