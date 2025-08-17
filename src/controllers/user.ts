import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';
import User, { Role, Status } from '../models/user';
import ForbiddenError from '../errors/forbidden-error';

const { CastError } = Error;

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const requestingUser = res.locals.user;

    if (requestingUser.role === Role.Admin) {
      const users = await User.find({});
      return res.send({ data: users });
    }

    throw new ForbiddenError('У вас нет прав на просмотр пользоватей');
  } catch (err) {
    return next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestingUser = res.locals.user;

    const user = await User.findById(req.params.id);

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    if (requestingUser.role === Role.Admin || String(requestingUser._id) === req.params.id) {
      return res.send({ data: user });
    }

    throw new ForbiddenError('У вас нет прав на просмотр этого пользователя');
  } catch (err) {
    if (err instanceof CastError) {
      return next(new BadRequestError('Некорректный идентификатор пользователя'));
    }
    return next(err);
  }
};

export const blockUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestingUser = res.locals.user;
    const targetUserId = req.params.id;
    const newStatus: Status = req.body.status;

    if (!Object.values(Status).includes(newStatus)) {
      return next(new BadRequestError('Некорректный статус пользователя'));
    }

    const user = await User.findById(targetUserId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    if (requestingUser.role !== Role.Admin && String(requestingUser._id) !== targetUserId) {
      throw new ForbiddenError('У вас нет прав на изменение статуса этого пользователя');
    }

    user.status = newStatus;
    await user.save();

    return res.send({ data: user });
  } catch (err) {
    if (err instanceof CastError) {
      return next(new BadRequestError('Некорректный идентификатор пользователя'));
    }
    return next(err);
  }
};
