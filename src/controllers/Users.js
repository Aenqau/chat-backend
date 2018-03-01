import User from '../models/user';
import HttpStatus from 'http-status-codes';
import { controller, get, post, put, del } from 'koa-dec-router';
import BaseCtrl from './Base';

@controller('/test')
export default class TestCtrl extends BaseCtrl {
    @get('')
    async getUsers(ctx) {
        try {
            const items = await User.find().lean();

            ctx.ok(items);
        } catch (err) {
            ctx.throw(HttpStatus.BAD_REQUEST, err.message);
        }
    }

    @post('')
    async createUser(ctx) {
        const user = User.create(ctx.request.body);
        try {
            await user.save()
        } catch (err) {
            ctx.throw(422, err.message)
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
    async getItemById(ctx) {
        // empty
    }

    @put('/:_id')
    async updateItem(ctx) {
        // empty
    }

    @del('/:_id')
    async deleteItem(ctx) {
        // empty
    }
}
