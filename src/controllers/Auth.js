import passport from 'koa-passport'
import User from '../models/user';
import { controller, post } from 'koa-dec-router';
import BaseCtrl from './Base';

@controller('/auth')
export default class AuthCtrl extends BaseCtrl {
    @post('')
    async authUser (ctx) {
        await ctx.login();
        if (ctx.isAuthenticated()) {
            const token = User.generateToken();
            const response = User.toJSON();
            delete response.password;
            ctx.body = {
                token,
                user: response
            }
        }
        else {
            ctx.throw(401)
        }
    }
}
