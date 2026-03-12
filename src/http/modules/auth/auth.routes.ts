import { Router } from "express";
import { AuthController } from "./auth.controllers.js";

export const AuthRouter = Router();

AuthRouter.post("/register", AuthController.registerUser);
AuthRouter.post("/login", AuthController.loginUser);
