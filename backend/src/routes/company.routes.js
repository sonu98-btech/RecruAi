import { Router } from "express";
import {
  createCompany,
  getCompany,
  listCompanies,
  updateCompany,
} from "../controllers/company.controller.js";
import { authorize } from "../middleware/role.middleware.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

router.get("/", listCompanies);
router.post("/", authorize(ROLES.SUPER_ADMIN), createCompany);
router.get("/:id", getCompany);
router.patch("/:id", authorize(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), updateCompany);

export default router;
