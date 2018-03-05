import User from '../models/user';
import HttpStatus from 'http-status-codes';
import { controller, get, post, put, del } from 'koa-dec-router';
import BaseCtrl from './Base';

@controller('/users')
export default class UsersCtrl extends BaseCtrl {
    @get('')
    async getUsers(ctx) {
        try {
            const users = await User.find({}, '-password');
            ctx.ok(users);
        } catch (err) {
            ctx.throw(HttpStatus.BAD_REQUEST, err.message);
        }
    }

    @post('')
    async createUser(ctx) {
        const user = new User(ctx.request.body);
        try {
            await user.save();
        } catch (err) {
            ctx.throw(422, err.message);
        }

        const token = user.generateToken();
        const response = user.toJSON();

        delete response.password;

        ctx.body = {
            user: response,
            token
        }
    }

    @get('/:_id')
    async getUser (ctx, next) {
        try {
            const user = await User.findById(ctx.params.id, '-password');
            if (!user) {
                ctx.throw(404)
            }
            ctx.body = {
                user
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
    async updateUser (ctx) {
        const user = ctx.body.user;

        Object.assign(user, ctx.request.body.user);

        await user.save();

        ctx.body = {
            user
        }
    }

    @del('/:_id')
    async deleteUser (ctx) {
        const user = ctx.body.user;

        await user.remove();

        ctx.status = 200;
        ctx.body = {
            success: true
        }
    }
}
