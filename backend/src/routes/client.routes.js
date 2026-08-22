import { Router } from "express";
import {
  createClient,
  deleteClient,
  getClient,
  listClients,
  updateClient,
} from "../controllers/client.controller.js";
import { requireTenant } from "../middleware/tenant.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createClientValidator } from "../validators/client.validator.js";
import { authorize } from "../middleware/role.middleware.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

router.use(requireTenant);
router.post("/", authorize(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN, ROLES.RECRUITER), validate(createClientValidator), createClient);
router.get("/", listClients);
router.get("/:id", getClient);
router.put("/:id", authorize(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN, ROLES.RECRUITER), updateClient);
router.delete("/:id", authorize(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN, ROLES.RECRUITER), deleteClient);

export default router;
