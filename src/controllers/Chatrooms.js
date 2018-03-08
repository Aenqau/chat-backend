import ChatRoom from '../models/chatroom';
import HttpStatus from 'http-status-codes';
import { controller, get, post, put, del } from 'koa-dec-router';
import BaseCtrl from './Base';

@controller('/chat')

export default class ChatCtrl extends BaseCtrl {
    //  get list of user,s chatrooms
    @get('')
    async getChats(ctx) {
        if (ctx.header.token === process.env.TOKEN) {
            try {
                const chats = await ChatRoom.find({
                    users : { $in : [{_id: process.env.USER_ID}] }
                });
                ctx.ok(chats);
            } catch (err) {
                ctx.throw(HttpStatus.BAD_REQUEST, err.message);
            }
        }
        else {
            ctx.status = 401;
        }
    }

    //  localhost:5002/api/chat/id:589891235herr
    @get('/:_id')
    async getChatById(ctx) {
        if (ctx.header.token === process.env.TOKEN) {
            try {
                await ChatRoom.find({
                    users : { $in : [{_id: process.env.USER_ID}] }
                });

                try {
                    const chat = await ChatRoom.find({
                        _id: ctx.params._id
                    });
                    ctx.ok(chat);
                } catch (err) {
                    ctx.throw(HttpStatus.BAD_REQUEST, err.message);
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
        }
    }

    @post('')
    async createChat(ctx) {
        //  TODO: find if there is a shorter way to check token
        //  check token identity
        if (ctx.request.body.token === process.env.TOKEN) {
            //  Check if that chat already exist
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
        else {
            ctx.status = 401;
            ctx.body = {
                success: false
            }
        }


    }

    @put('/:_id')
    async updateChat (ctx) {
        if (ctx.header.token === process.env.TOKEN) {
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
        else {
            ctx.status = 401;
        }
    }

    @del('/:_id')
    async deleteChat (ctx) {
        if (ctx.header.token === process.env.TOKEN) {
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
        else {
            ctx.status = 401;
        }
    }
}
