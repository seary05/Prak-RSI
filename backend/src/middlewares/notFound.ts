import type { RequestHandler } from 'express';
import { NotFoundError } from '../errors/NotFoundError.ts';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new NotFoundError(`Rute ${req.method} ${req.originalUrl} tidak ditemukan`));
};