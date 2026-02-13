export interface Login {
  email: string;
  password: string;
}

export type SignUp = Login & {
  nickname: string;
};
