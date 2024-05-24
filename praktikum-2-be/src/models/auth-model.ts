export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  full_name: string;
  phone_number: string;
  email: string;
  password: string;
};

export type VerifyEmailRequest = {
  otp: string;
  token: string;
};