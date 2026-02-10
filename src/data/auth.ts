import { prisma } from './lib/prisma';
import { Prisma } from '../generated/prisma';

type SignUp = Login & {
  nickname: string;
};

interface Login {
  email: string;
  password: string;
}

export const createUser = async (user: SignUp) => {
  try {
    const createdUser = await prisma.user.create({
      data: { ...user },
    });
    return createdUser;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        throw new Error('AlreadyExistsEmail');
      }
    }

    console.error(err, 'user 생성 중 예상치 못한 에러 발생');
    throw new Error('DatabaseError');
  }
};

export const findUserByEmail = async (email: string) => {
  try {
    const foundedUser = await prisma.user.findUnique({
      where: { email },
    });
    return foundedUser;
  } catch (err) {
    console.error(err);
  }
};
