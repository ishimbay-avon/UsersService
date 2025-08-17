import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { AUTH_ACCESS_TOKEN_SECRET } from '../config';
import ForbiddenError from '../errors/forbidden-error';
import UnauthorizedError from '../errors/unauthorized-error';
import UserModel from '../models/user';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let payload: JwtPayload | null = null;
  const authHeader = req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Невалидный токен');
  }
  try {
    const accessTokenParts = authHeader.split(' ');
    const aTkn = accessTokenParts[1];
    payload = jwt.verify(aTkn, AUTH_ACCESS_TOKEN_SECRET) as JwtPayload;

    const user = await UserModel.findOne(
      {
        _id: new Types.ObjectId(payload._id),
      },
      { password: 0, salt: 0 },
    );

    if (!user) {
      return next(new ForbiddenError('Нет доступа'));
    }

    res.locals.user = user;

    return next();
  } catch (error) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Истек срок действия токена'));
    }
    return next(new UnauthorizedError('Необходима авторизация'));
  }
};

export default authMiddleware;
