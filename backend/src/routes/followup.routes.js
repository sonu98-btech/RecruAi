import { Router } from "express";
import { createFollowup, listFollowups, updateFollowup } from "../controllers/followup.controller.js";
import { requireTenant } from "../middleware/tenant.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createFollowupValidator } from "../validators/followup.validator.js";

const router = Router();

router.use(requireTenant);
router.post("/", validate(createFollowupValidator), createFollowup);
router.get("/", listFollowups);
router.put("/:id", updateFollowup);

export default router;
