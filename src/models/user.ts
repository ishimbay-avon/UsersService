import mongoose, { Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import UnauthorizedError from '../errors/internal-error';

export enum Status {
  Active = 'active',
  Inactive = 'inactive',
}

export enum Role {
  User = 'user',
  Admin = 'admin',
}

interface IUser extends Document {
  fullname: string;
  birthdate: Date;
  email: string;
  password: string;
  role: Role;
  status: Status;
  refreshToken: string;
}

interface IUserModel extends mongoose.Model<IUser> {
  findUserByCredentials(
    email: string,
    password: string
  ): Promise<mongoose.HydratedDocument<IUser>>;
}

const userSchema = new mongoose.Schema<IUser, IUserModel>(
  {
    fullname: {
      type: String,
      required: true,
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
    birthdate: {
      type: Date,
      default: null,
    },
    email: {
      type: String,
      required: [true, 'Поле "email" должно быть заполнено'],
      unique: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: 'Поле "email" должно быть валидным email-адресом',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено'],
      minlength: [6, 'Минимальная длина поля "password" - 6'],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.User,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.Active,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
);

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user: IUser | null) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }

          return user;
        });
    });
});

export default mongoose.model<IUser, IUserModel>('user', userSchema);
