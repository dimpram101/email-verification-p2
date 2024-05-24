import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";
import { TokenMiddleware } from "../middlewares/token_middleware";

const authRoutes: Router = Router();

authRoutes.get("/me", [TokenMiddleware.verifyToken, AuthController.me]); 
authRoutes.post("/register", AuthController.register);
authRoutes.post("/login", AuthController.login);
authRoutes.post("/send-verify-email", [TokenMiddleware.verifyToken, AuthController.sendVerifyEmail]);
authRoutes.post("/verify-email", [TokenMiddleware.verifyToken, AuthController.verifyEmail]);

export default authRoutes;