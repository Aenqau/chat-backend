import User from '../models/user';
import HttpStatus from 'http-status-codes';
import { controller, get, post, put, del } from 'koa-dec-router';
import BaseCtrl from './Base';

@controller('/test')
export default class TestCtrl extends BaseCtrl {
  @get('')
  async getList(ctx) {
    try {
      const items = await User.find().lean();

      ctx.ok(items);
    } catch (err) {
      ctx.throw(HttpStatus.BAD_REQUEST, err.message);
    }
  }

  @post('')
  async createItem(ctx) {
      const userOne = User.create({
          name: ctx.request.body.nameTaskOne,
          urgency: ctx.request.body.urgencyTaskOne
      });
      const userTwo = User.create({
          name: ctx.request.body.nameTaskTwo,
          urgency: ctx.request.body.urgencyTaskTwo
      });
      const [t1, t2] = await Promise.all([userOne, userTwo]);
      if (!t1 || !t2) {
          throw new Error('Users failed to be created.')
      } else {
          ctx.body = {message: 'Users created!', taskOne: t1, taskTwo: t2}
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
