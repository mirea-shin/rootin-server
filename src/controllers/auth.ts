import { Request, Response } from 'express';
import { pwdToHashed, createToken, comparePwd } from '../utils/auth';
import * as authRepository from '../data/auth';
import { handleError } from '../utils/controller';

export const signup = async (req: Request, res: Response) => {
  try {
    const { user: parsedUser } = req.body;

    if (!parsedUser || !parsedUser.email || !parsedUser.password)
      throw new Error(
        'BadRequest:필수 항목(이메일, 비밀번호 등)이 누락되었습니다.',
      );

    const hasedPwd = await pwdToHashed(parsedUser.password);

    const createdUser = await authRepository.createUser({
      ...parsedUser,
      password: hasedPwd,
    });

    const { id, email, nickname } = createdUser;
    const token = await createToken({ user_id: id, email });
    return res
      .status(201)
      .json({ user: { user_id: id, email, nickname }, token });
  } catch (err) {
    return handleError(res, err);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { user: parsedUser } = req.body;
    if (!parsedUser || !parsedUser.email || !parsedUser.password)
      throw new Error(
        'BadRequest:필수 항목(이메일, 비밀번호 등)이 누락되었습니다.',
      );

    const foundedUser = await authRepository.findUserByEmail(
      parsedUser.email,
    );
    if (!foundedUser) throw new Error('InvalidCredentials');

    const checkedPwd = await comparePwd(
      parsedUser.password,
      foundedUser.password,
    );
    if (!checkedPwd) throw new Error('InvalidCredentials');

    const { id, email, nickname } = foundedUser;
    const token = await createToken({ user_id: id, email });

    return res
      .status(200)
      .json({ user: { user_id: id, email, nickname }, token });
  } catch (err) {
    return handleError(res, err);
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const { user } = req;
    if (!user) throw new Error('UserNotFound');
    return res.status(200).json({ user: user });
  } catch (err) {
    return handleError(res, err);
  }
};
