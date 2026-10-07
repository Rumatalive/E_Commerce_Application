import { Router } from "express";
import { register, login, profile, forgotPassword, resetPassword } from "../controller/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/profile", authenticate, profile);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

export default authRouter;