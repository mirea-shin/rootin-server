import { Request, Response } from 'express';

const ERROR_MAP: Record<string, { status: number; error: string; message: string }> = {
  BadRequest: {
    status: 400,
    error: 'Bad Request',
    message: '필수 항목이 누락되었습니다.',
  },
  UserNotFound: {
    status: 401,
    error: 'Unauthorized',
    message: '인증 정보를 찾을 수 없습니다. 다시 로그인해주세요.',
  },
  InvalidCredentials: {
    status: 401,
    error: 'Unauthorized',
    message: '이메일 또는 비밀번호가 올바르지 않습니다.',
  },
  AlreadyExistsEmail: {
    status: 409,
    error: 'Conflict',
    message: '이미 사용 중인 이메일입니다.',
  },
  RoutineNotFound: {
    status: 404,
    error: 'Not Found',
    message: '루틴을 찾을 수 없거나 권한이 없습니다.',
  },
  TaskNotFound: {
    status: 404,
    error: 'Not Found',
    message: '태스크를 찾을 수 없거나 권한이 없습니다.',
  },
};

const INTERNAL_ERROR = {
  status: 500,
  error: 'Internal Server Error',
  message: '현재 서비스 처리가 원활하지 않습니다. 잠시 후 다시 시도해주세요.',
};

export const handleError = (res: Response, err: unknown) => {
  const raw = err instanceof Error ? err.message : 'UnknownError';
  const [errorKey, ...rest] = raw.split(':');
  const customMessage = rest.length > 0 ? rest.join(':') : undefined;
  const mapped = ERROR_MAP[errorKey];

  if (mapped)
    return res
      .status(mapped.status)
      .json({ ...mapped, message: customMessage ?? mapped.message });

  console.error(`[Error] ${raw}`);
  return res.status(500).json(INTERNAL_ERROR);
};

export const getUserId = (req: Request): number => {
  const userId = req?.user?.user_id;
  if (!userId) throw new Error('UserNotFound');
  return Number(userId);
};
