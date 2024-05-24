import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ErrorResponse } from "../models/error-model";

export class TokenMiddleware {
  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const splittedToken = req.headers.authorization?.split(" ");
      const token = splittedToken && splittedToken[splittedToken.length - 1];
      
      if (!token) {
        throw new ErrorResponse("Unauthorized", 401, ["token"], "UNAUTHORIZED");
      }

      const decoded = jwt.verify(token, process.env.TOKEN_SECRET!);
      res.locals.user = decoded;

      next();
    } catch (error) {
      next(error);
    }
  }
}
