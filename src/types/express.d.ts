declare namespace Express {
  interface Request {
    user?: {
      user_id: number;
      email: string;
    };
  }
}
