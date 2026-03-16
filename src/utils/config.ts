const config = {
  auth: {
    get saltRound() {
      return Number(process.env.SALT_ROUND) || 10;
    },
    get jwtSecret() {
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error('JWT_SECRET 환경변수가 설정되지 않았습니다.');
      return secret;
    },
  },
};

export default config;
