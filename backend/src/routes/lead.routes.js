import { Router } from "express";
import {
  convertLead,
  createLead,
  deleteLead,
  getLead,
  listLeads,
  updateLead,
} from "../controllers/lead.controller.js";
import { requireTenant } from "../middleware/tenant.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createLeadValidator } from "../validators/lead.validator.js";

const router = Router();

router.use(requireTenant);
router.post("/", validate(createLeadValidator), createLead);
router.get("/", listLeads);
router.get("/:id", getLead);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);
router.post("/:id/convert", convertLead);

export default router;
