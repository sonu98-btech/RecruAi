import { Router } from "express";
import {
  createCandidate,
  deleteCandidate,
  getCandidate,
  listCandidates,
  updateCandidate,
  uploadResume,
} from "../controllers/candidate.controller.js";
import { requireTenant } from "../middleware/tenant.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { resumeUpload } from "../middleware/upload.middleware.js";
import {
  createCandidateValidator,
  updateCandidateValidator,
} from "../validators/candidate.validator.js";
import { authorize } from "../middleware/role.middleware.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

router.use(requireTenant);
router.post("/", validate(createCandidateValidator), createCandidate);
router.get("/", listCandidates);
router.get("/:id", getCandidate);
router.put("/:id", validate(updateCandidateValidator), updateCandidate);
router.delete("/:id", authorize(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN, ROLES.RECRUITER), deleteCandidate);
router.post("/:id/resume", resumeUpload.single("resume"), uploadResume);

export default router;
