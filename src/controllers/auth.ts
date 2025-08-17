import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import ConflictError from '../errors/conflict-error';
import { AUTH_ACCESS_TOKEN_SECRET, AUTH_REFRESH_TOKEN_SECRET } from '../config';
import User from '../models/user';
import NotFoundError from '../errors/not-found-error';
import UnauthorizedError from '../errors/unauthorized-error';

// POST /auth/login
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findUserByCredentials(email, password);
    const accessToken = jwt.sign({ _id: user._id }, AUTH_ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
    const refreshToken = jwt.sign({ _id: user._id }, AUTH_REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      sameSite: 'strict',
      httpOnly: true,
      maxAge: 604800000, // 7 дней
    });

    res.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
      },
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

// POST /auth/register
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      email, password, fullname, birthdate, role,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname,
      birthdate,
      email,
      password: hashedPassword,
      role,
      status: 'active',
      refreshToken: '',
    });

    const accessToken = jwt.sign({ _id: user._id }, AUTH_ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
    const refreshToken = jwt.sign({ _id: user._id }, AUTH_REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      sameSite: 'strict',
      httpOnly: true,
      maxAge: 604800000, // 7 дней
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
      },
      accessToken,
    });
  } catch (err) {
    if ((err as any).code === 11000) {
      next(new ConflictError('Пользователь с таким email или паролем уже существует'));
    } else {
      next(err);
    }
  }
};

// POST /auth/logout
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      const payload = jwt.decode(refreshToken) as { _id: string } | null;
      if (payload) {
        const user = await User.findById(payload._id);

        if (!user) {
          throw new NotFoundError('Пользователь не найден');
        }

        user.refreshToken = '';
        await user.save();
      }
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
    });

    res.status(200).json({ success: true, message: 'Успешно вышли из системы' });
  } catch (error) {
    next(error);
  }
};

// POST /auth/token
export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new UnauthorizedError('Отсутствует токен');
    }

    const payload = jwt.decode(refreshToken) as { _id: string } | null;
    if (!payload) {
      throw new UnauthorizedError('Не валидный токен');
    }

    const user = await User.findById(payload._id);
    if (!user) {
      throw new UnauthorizedError('Пользователь не найден');
    }

    if (user.refreshToken !== refreshToken) {
      throw new UnauthorizedError('Токены не совпадает');
    }

    const newAccessToken = jwt.sign({ _id: user._id }, AUTH_ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
    const newRefreshToken = jwt.sign({ _id: user._id }, AUTH_REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie('refreshToken', newRefreshToken, {
      sameSite: 'strict',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

    res.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
      },
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};
