import type {
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
} from "../models/auth-model";
import db from "../../configs/database";
import type { Client, Pool } from "pg";
import bcrypt from "bcrypt";
import { ErrorResponse } from "../models/error-model";
import jwt from "jsonwebtoken";
import {
  generate4RandomDigits,
  generateRandomString,
} from "../utils/generator";
import { sendEmail } from "../utils/nodemailer";
import { Validation } from "../validations/validation";
import { AuthValidation } from "../validations/auth-validation";

const saltRounds = 10;

export class AuthService {
  private db: Pool = db;

  static async me(id: number) {
    const query = {
      text: `SELECT id, full_name, email, phone_number, verified_at, created_at FROM users WHERE id = $1`,
      values: [id],
    };
    const results = await db.query(query);
    return results.rows[0];
  }

  static async register(data: RegisterRequest) {
    const request = Validation.validate(AuthValidation.REGISTER, data);

    const { full_name, phone_number, email, password } = request;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = {
      text: `INSERT INTO users (full_name, phone_number, email, password) VALUES ($1, $2, $3, $4) RETURNING *`,
      values: [full_name, phone_number, email, hashedPassword],
    };
    await db.query(query);
  }

  static async login(data: LoginRequest) {
    const request = Validation.validate(AuthValidation.LOGIN, data);

    const { email, password } = request;

    const query = {
      text: `SELECT * FROM users WHERE email = $1`,
      values: [email],
    };
    const results = await db.query(query);
    const user = results.rows[0];

    if (!user) {
      throw new ErrorResponse("Invalid email or password", 400, [
        "email",
        "password",
      ]);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new ErrorResponse("Invalid email or password", 400, [
        "email",
        "password",
      ]);
    }

    // expires in 1 hour in Date
    const expiresIn = new Date(Date.now() + 60 * 60 * 1000);

    const token = jwt.sign({ id: user.id, email }, process.env.TOKEN_SECRET!, {
      expiresIn: "1h",
    });

    return { token, expiresIn };
  }

  static async sendVerifyEmail(id: number) {
    const getUserQuery = {
      text: `SELECT * FROM users WHERE id = $1`,
      values: [id],
    };

    const userResults = await db.query(getUserQuery);
    const user = userResults.rows[0];

    if (!user) {
      throw new ErrorResponse("User not found", 404, ["id"]);
    }

    if (user.is_verified) {
      throw new ErrorResponse("User already verified", 400, ["id"]);
    }

    const otp = generate4RandomDigits();
    const token = generateRandomString(16);
    const expiredAt = new Date(Date.now() + 5 * 60000);

    const query = {
      text: `INSERT INTO verification_tokens (token, otp_code, user_id, expired_at) VALUES ($1, $2, $3, $4)`,
      values: [token, otp, user.id, expiredAt],
    };

    await db.query(query);

    sendEmail({
      to: user.email,
      subject: "Verify your email address",
      text: `Your OTP code is ${otp}. This OTP will expire in 5 minutes. Please verify your email address by entering this OTP code in the link below.\n\nhttp://localhost:5173/verify-email?token=${token}
      `,
    });
  }

  static async verifyEmail(id: number, data: VerifyEmailRequest) {
    const request = Validation.validate(AuthValidation.VERIFY_EMAIL, data);

    const { otp, token } = request;

    const userQuery = {
      text: `SELECT * FROM users WHERE id = $1`,
      values: [id],
    };

    const userResults = await db.query(userQuery);
    const user = userResults.rows[0];

    if (!user) {
      throw new ErrorResponse("User not found", 404, ["id"]);
    }

    if (user.is_verified) {
      throw new ErrorResponse("User already verified", 400, ["id"]);
    }

    const query = {
      text: `SELECT * FROM verification_tokens WHERE token = $1`,
      values: [token],
    };

    const results = await db.query(query);
    const verificationToken = results.rows[0];

    if (!verificationToken) {
      throw new ErrorResponse("Invalid token", 400, ["token"]);
    }

    if (verificationToken.expired_at < new Date()) {
      throw new ErrorResponse("Token expired", 400, ["token"]);
    }

    if (verificationToken.otp_code !== otp) {
      throw new ErrorResponse("Invalid OTP", 400, ["otp"]);
    }

    const updateQuery = {
      text: `UPDATE users SET is_verified = true, verified_at = $1 WHERE id = $2`,
      values: [new Date(), verificationToken.user_id],
    };

    await db.query(updateQuery);
  }
}
