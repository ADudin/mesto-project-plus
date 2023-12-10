import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import RequestError from '../errors/request-error';
import STATUS_CODES from '../utils/status-codes';

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new RequestError(STATUS_CODES.UNAUTHORIZED, 'Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new RequestError(STATUS_CODES.UNAUTHORIZED, 'Необходима авторизация');
  }

  req.user = payload;

  next();
};
