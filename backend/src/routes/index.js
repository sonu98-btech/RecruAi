import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { tenantIsolation } from "../middleware/tenant.middleware.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import companyRoutes from "./company.routes.js";
import candidateRoutes from "./candidate.routes.js";
import clientRoutes from "./client.routes.js";
import leadRoutes from "./lead.routes.js";
import callRoutes from "./call.routes.js";
import aiRoutes from "./ai.routes.js";
import followupRoutes from "./followup.routes.js";
import campaignRoutes from "./campaign.routes.js";
import notificationRoutes from "./notification.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/calls", callRoutes);

router.use(authenticate, tenantIsolation);
router.use("/users", userRoutes);
router.use("/companies", companyRoutes);
router.use("/candidates", candidateRoutes);
router.use("/clients", clientRoutes);
router.use("/leads", leadRoutes);
router.use("/ai", aiRoutes);
router.use("/followups", followupRoutes);
router.use("/campaigns", campaignRoutes);
router.use("/notifications", notificationRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
