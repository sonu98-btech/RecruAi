import { Router } from "express";
import { analyzeCall, analyzeStoredCall } from "../controllers/ai.controller.js";
import { requireTenant } from "../middleware/tenant.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { analyzeCallValidator } from "../validators/call.validator.js";

const router = Router();

router.post("/analyze-call", validate(analyzeCallValidator), analyzeCall);
router.post("/calls/:id/analyze", requireTenant, validate(analyzeCallValidator), analyzeStoredCall);

export default router;
