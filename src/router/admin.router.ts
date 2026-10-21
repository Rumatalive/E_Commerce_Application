import { Router } from "express";
import { createSeller, getDashboard } from "../controller/admin.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";

const adminRouter = Router();

adminRouter.use(authenticate, requireAdmin);
adminRouter.get("/dashboard", getDashboard);
adminRouter.post("/sellers", createSeller);

export default adminRouter;