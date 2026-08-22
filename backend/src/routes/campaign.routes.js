import { Router } from "express";
import {
  createCampaign,
  getCampaign,
  listCampaigns,
  pauseCampaign,
  startCampaign,
  updateCampaign,
} from "../controllers/campaign.controller.js";
import { requireTenant } from "../middleware/tenant.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createCampaignValidator } from "../validators/followup.validator.js";
import { authorize } from "../middleware/role.middleware.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

router.use(requireTenant);
router.post("/", authorize(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN, ROLES.RECRUITER), validate(createCampaignValidator), createCampaign);
router.get("/", listCampaigns);
router.get("/:id", getCampaign);
router.put("/:id", authorize(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN, ROLES.RECRUITER), updateCampaign);
router.post("/:id/start", authorize(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN, ROLES.RECRUITER), startCampaign);
router.post("/:id/pause", authorize(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN, ROLES.RECRUITER), pauseCampaign);

export default router;
