import { Router } from "express";
import { overview } from "../controllers/dashboard.controller.js";
import { requireTenant } from "../middleware/tenant.middleware.js";

const router = Router();
router.use(requireTenant);
router.get("/overview", overview);

export default router;
