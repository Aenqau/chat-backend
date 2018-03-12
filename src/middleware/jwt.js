import { verify } from 'koa-jwt';
import { getToken } from '../utils/auth'

export async function verifyToken(ctx, next) {
    const token = getToken(ctx);

    if (!token) {
        ctx.throw(401)
    }

    try {
        verify(token, process.env.TOKEN)
    } catch (err) {
        ctx.throw(401)
    }

    return next();
}