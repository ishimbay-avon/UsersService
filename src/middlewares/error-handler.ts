import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import BaseError from '../errors/base-error';
import InternalError from '../errors/internal-error';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let error : Error | BaseError = err;

  // Обработка ошибок валидации Mongoose
  if (error instanceof MongooseError.ValidationError) {
    error = new BadRequestError('Ошибка валидации данных');
  }

  // Обработка ошибок дублирования уникального поля MongoDB (E11000)
  if (error instanceof Error && error.message.includes('E11000')) {
    error = new ConflictError('Пользователь с таким email или паролем уже существует');
  }

  // Если ошибка не имеет статус-кода, считаем её внутренней ошибкой сервера
  if (!(error instanceof BaseError)) {
    error = new InternalError('На сервере произошла ошибка');
  }
  // Возвращаем ответ клиенту
  return res.status((error as BaseError).statusCode).json({
    message: error.message || 'Ошибка сервера',
  });
};

export default errorHandler;
