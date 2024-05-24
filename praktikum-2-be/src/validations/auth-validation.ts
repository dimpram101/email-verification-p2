import z, { ZodType } from "zod";

export class AuthValidation {
  static readonly LOGIN: ZodType = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  static readonly REGISTER: ZodType = z.object({
    full_name: z.string(),
    phone_number: z.string().min(10).max(13),
    email: z.string().email(),
    password: z.string().min(8),
  });

  static readonly VERIFY_EMAIL: ZodType = z.object({
    otp: z.string().length(4),
    token: z.string().length(16, "Token invalid"),
  });
}
