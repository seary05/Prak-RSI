import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError.ts';
import { verifyToken } from '../services/tokenService.ts';
import type { AuthUser } from '../services/tokenService.ts';

export const authenticate: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;
  const token = authorization?.match(/^Bearer\s+(\S+)\s*$/i)?.[1] ?? '';
  if (!token) return next(new UnauthorizedError('Header Authorization Bearer wajib dikirim'));

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return next(new UnauthorizedError());
  }
};

export function getUser(req: Request): AuthUser {
  if (!req.user) throw new UnauthorizedError('Endpoint ini wajib memakai authenticate');
  return req.user;
}