import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from './config';

const createSalt = async () =>
  await bcrypt.genSalt(config.auth.saltRound);

export const comparePwd = async (pwd: string, hashedPwd: string) => {
  try {
    const checked = await bcrypt.compare(pwd, hashedPwd);
    return checked;
  } catch (err) {
    console.error(err);
  }
};

export const pwdToHashed = async (pwd: string) => {
  try {
    const salt = await createSalt();
    const hash = await bcrypt.hash(pwd, salt);
    return hash;
  } catch (err) {
    console.error(err, '해시 함수에서 에러발생');
  }
};

export const createToken = (tokenKey: { user_id: number; email: string }) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(
      { data: { ...tokenKey } },
      config.auth.jwtSecret,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('JWT 생성 에러:', err);
          return reject(new Error('TokenGenerationFailed'));
        }
        resolve(token as string);
      },
    );
  });
};

export const validateToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, config.auth.jwtSecret) as {
      data: { user_id: number; email: string };
    };
    if (!decoded) throw new Error('InvalidToken');

    return decoded;
  } catch (err) {
    console.error('JWT 에러:', err);
    throw new Error('InvalidToken');
  }
};
