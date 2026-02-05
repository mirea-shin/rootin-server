import express from 'express';

import { signup, login, getMe } from '../controllers/auth';
import { authMe } from '../middlewares/auth';

const authRoute = express().router;

authRoute.post('/signup', signup);
authRoute.post('/login', login);
authRoute.get('/me', authMe, getMe);

export default authRoute;
