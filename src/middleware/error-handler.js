import { logger } from '../lib/logger';
import { env } from '../lib/env';

/**
 * Error handler middleware.
 * Uses status code from error if present.
 */
export async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (err) {
    ctx.status = (err && err.statusCode) || 500;

    ctx.body = err.toJSON ? err.toJSON() : { message: err.message, ...err };
    /* istanbul ignore next */
    if (!env.EMIT_STACK_TRACE) {
      delete ctx.body.stack;
    }
    logger.error('Error in request', err);
  }
}
