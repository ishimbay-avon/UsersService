import cookieParser from 'cookie-parser';
import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import { errorLogger, requestLogger } from './middlewares/logger';
import { PORT, DB_ADDRESS } from './config';
import errorHandler from './middlewares/error-handler';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(DB_ADDRESS)
  .then(() => {
    console.log('Успешное подключение к MongoDB!');
  })
  .catch((err) => {
    console.error('Ошибка подключения:', err);
  });

app.use(requestLogger);

app.use('/auth', authRouter);

app.use('/user', userRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
