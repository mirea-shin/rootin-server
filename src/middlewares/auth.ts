import { NextFunction, Request, Response } from 'express';
import { validateToken } from '../utils/auth';

export const authMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new Error('No token');

    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new Error('InvalidFormat');
    }
    const result = await validateToken(token);
    if (!result || !result.data) {
      throw new Error('InvalidToken');
    }

    req.user = result.data;
    next();
  } catch (err: any) {
    console.error(`[Auth Error] ${err.message}`);
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
      message: '인증이 필요하거나 토큰이 유효하지 않습니다.',
    });
  }
};
