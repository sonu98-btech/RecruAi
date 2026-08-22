import { Router } from "express";
import { createCall, getCall, listCalls, twilioStatusWebhook, twilioVoiceWebhook, twilioRecordingWebhook } from "../controllers/call.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { tenantIsolation, requireTenant } from "../middleware/tenant.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createCallValidator } from "../validators/call.validator.js";

const router = Router();

router.post("/webhooks/twilio/status", twilioStatusWebhook);
router.post("/webhooks/twilio/voice", twilioVoiceWebhook);
router.post("/webhooks/twilio/recording", twilioRecordingWebhook);

router.use(authenticate, tenantIsolation, requireTenant);
router.post("/", validate(createCallValidator), createCall);
router.get("/", listCalls);
router.get("/:id", getCall);

export default router;
