import { Router } from 'express';
import {
  login,
  logout,
  refreshAccessToken,
  register,
} from '../controllers/auth';
import { validateAuthentication, validateUserBody } from '../middlewares/validatons';

const authRouter = Router();

authRouter.post('/login', validateAuthentication, login);
authRouter.post('/token', refreshAccessToken);
authRouter.post('/logout', logout);
authRouter.post('/register', validateUserBody, register);

export default authRouter;
