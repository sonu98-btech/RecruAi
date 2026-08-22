import { Router } from "express";
import { createUser, listUsers, updateUser } from "../controllers/user.controller.js";
import { authorize } from "../middleware/role.middleware.js";
import { requireTenant } from "../middleware/tenant.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createUserValidator } from "../validators/auth.validator.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

router.use(requireTenant);
router.get("/", listUsers);
router.post(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN),
  validate(createUserValidator),
  createUser,
);
router.patch("/:id", authorize(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), updateUser);

export default router;
