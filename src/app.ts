import cookieParser from 'cookie-parser';
import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import { errorLogger, requestLogger } from './middlewares/logger';
import { PORT, DB_ADDRESS } from './config';

const app = express();

app.use(requestLogger);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);

app.use('/user', userRouter);

app.use(errorLogger);

mongoose
  .connect(DB_ADDRESS)
  .then(() => {
    console.log('Успешное подключение к MongoDB!');
  })
  .catch((err) => {
    console.error('Ошибка подключения:', err);
  });

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
