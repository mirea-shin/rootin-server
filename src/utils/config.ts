const config = {
  auth: {
    get saltRound() {
      return Number(process.env.SALT_ROUND) || 10;
    },
    get jwtSecret() {
      return process.env.JWT_SECRET || '';
    },
  },
};

export default config;
