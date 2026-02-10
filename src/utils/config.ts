const config = {
  auth: {
    saltRound: Number(process.env.SALT_ROUND) || 10,
    jwtSecret: process.env.JWT_SECRET || '',
  },
};

export default config;
