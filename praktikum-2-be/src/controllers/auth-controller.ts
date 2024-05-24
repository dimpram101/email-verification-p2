import type { NextFunction, Request, Response } from "express";
import type {
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
} from "../models/auth-model";
import { AuthService } from "../services/auth-service";

export class AuthController {
  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.user.id;
      const user = await AuthService.me(Number(id));

      res.status(200).json({
        status: "success",
        data: user,
        message: "User data retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as RegisterRequest;
      await AuthService.register(data);

      res.status(201).json({
        status: "success",
        message: "User registered successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as LoginRequest;
      const { token, expiresIn } = await AuthService.login(data);

      res.status(200).json({
        status: "success",
        data: { token, expiresIn },
        message: "User logged in successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async sendVerifyEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = res.locals.user.id;
      await AuthService.sendVerifyEmail(Number(id));

      res.status(200).json({
        status: "success",
        message:
          "An Email has been sent to your email address, please verify your email address with OTP code that we sent to your email address",
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.user.id;
      const { otp } = req.body;
      const { token } = req.query;
      await AuthService.verifyEmail(Number(id), {
        otp,
        token: token as string,
      });

      res.status(200).json({
        status: "success",
        message: "Email verified successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
