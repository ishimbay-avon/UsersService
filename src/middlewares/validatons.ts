import { Joi, Segments, celebrate } from 'celebrate';
import { Types } from 'mongoose';
import { Status } from '../models/user';

const objectIdValidator = (value: string, helpers: any) => {
  if (value.length === 24 && Types.ObjectId.isValid(value)) {
    return value;
  }
  return helpers.message({ custom: 'Невалидный id' });
};

export const validateUserBody = celebrate({
  body: Joi.object().keys({
    fullname: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
        'any.required': 'Поле "name" обязательно',
      }),
    password: Joi.string().min(6).max(100).required()
      .messages({ 'string.empty': 'Поле "password" должно быть заполнено' }),
    email: Joi.string()
      .required()
      .email()
      .max(100)
      .messages({
        'string.email': 'Поле "email" должно быть валидным email-адресом',
        'string.empty': 'Поле "email" должно быть заполнено',
        'any.required': 'Поле "email" обязательно',
      }),
    birthdate: Joi.date().iso().optional(),
    role: Joi.string().valid('user', 'admin').optional(),
  }),
});

export const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .max(100)
      .message('Поле "email" должно быть валидным email-адресом')
      .messages({
        'string.required': 'Поле "email" должно быть заполнено',
      }),
    password: Joi.string().required().max(100).messages({
      'string.empty': 'Поле "password" должно быть заполнено',
    }),
  }),
});

export const validateBlockUser = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.string()
      .hex()
      .length(24)
      .required()
      .messages({
        'string.length': 'Идентификатор пользователя должен быть 24 символа',
        'string.hex': 'Идентификатор пользователя должен содержать только шестнадцатеричные символы',
        'any.required': 'Идентификатор пользователя обязателен',
      }),
  }),
  [Segments.BODY]: Joi.object({
    status: Joi.string()
      .valid(...Object.values(Status))
      .required()
      .messages({
        'any.only': `Статус должен быть одним из следующих значений: ${Object.values(Status).join(', ')}`,
        'any.required': 'Поле статус обязательно для заполнения',
      }),
  }),
});

export const validateObjId = celebrate({
  params: Joi.object().keys({
    id: Joi.string()
      .custom(objectIdValidator)
      .required()
      .messages({
        'any.required': 'Параметр id обязателен',
        'string.empty': 'Параметр id не может быть пустым',
      }),
  }),
});
