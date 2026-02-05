import { Request, Response } from 'express';
import { pwdToHashed, createToken, comparePwd } from '../utils/auth';
import * as authRepository from '../data/auth';

export const signup = async (req: Request, res: Response) => {
  try {
    const { user: parsedUser } = req.body;

    // 1. 클라이언트 입력값 검증
    if (!parsedUser || !parsedUser.email || !parsedUser.password)
      return res.status(400).json({
        status: 400,
        error: 'Bad Request',
        message: '필수 항목(이메일, 비밀번호 등)이 누락되었습니다.',
      });

    // 2. 비밀번호 인코딩
    const hasedPwd = await pwdToHashed(parsedUser.password);

    // 3. 유저 DB 추가
    const createdUser = await authRepository.createUser({
      ...parsedUser,
      password: hasedPwd,
    });

    // 4. 토큰 생성 및 응답
    const { id, email, nickname } = createdUser;
    const token = await createToken({ user_id: id, email });
    return res
      .status(201)
      .json({ user: { user_id: id, email, nickname }, token });
  } catch (err: any) {
    console.error(`[Signup Error] ${err.message}`);

    if (err.message === 'AlreadyExistsEmail')
      return res.status(409).json({
        status: 409,
        error: 'Conflict',
        message: '이미 사용 중인 이메일입니다.',
      });

    return res.status(500).json({
      status: 500,
      error: 'Internal Server Error',
      message:
        '현재 서비스 처리가 원활하지 않습니다. 잠시 후 다시 시도해주세요.',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // 1. 클라이언트 입력 값 검증
    const { user: parsedUser } = req.body;
    if (!parsedUser || !parsedUser.email || !parsedUser.password)
      return res.status(400).json({
        status: 400,
        error: 'Bad Request',
        message: '필수 항목(이메일, 비밀번호 등)이 누락되었습니다.',
      });

    // 2. 유저 존재 여부 확인
    const foundedUser = await authRepository.findUserByEmail(parsedUser.email);
    if (!foundedUser) throw new Error('InvalidCredentials');

    // 3. 비밀번호 일치 여부 확인
    const checkedPwd = await comparePwd(
      parsedUser.password,
      foundedUser.password,
    );
    if (!checkedPwd) throw new Error('InvalidCredentials');

    // 4. 토큰 생성 및 응답
    const { id, email, nickname } = foundedUser;
    const token = await createToken({ user_id: id, email });

    return res
      .status(200)
      .json({ user: { user_id: id, email, nickname }, token });
  } catch (err: any) {
    if (err.message === 'InvalidCredentials')
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      });
    return res.status(500).json({
      status: 500,
      error: 'Internal Server Error',
      message:
        '현재 서비스 처리가 원활하지 않습니다. 잠시 후 다시 시도해주세요.',
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const { user } = req;
    if (!user) throw new Error('UserNotFound');
    return res.status(200).json({ user: user });
  } catch (err: any) {
    console.error(`[GetMe Error] ${err.message}`);

    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
      message: '인증 세션이 만료되었습니다. 다시 로그인해주세요.',
    });
  }
};
