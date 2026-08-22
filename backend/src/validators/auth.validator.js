import { collect, requiredEmail, requiredString } from "./helpers.js";
import { ROLES } from "../utils/constants.js";

export function loginValidator(req) {
  return collect(requiredEmail(req.body.email), requiredString(req.body.password, "password", 8));
}

export function registerCompanyValidator(req) {
  const { companyName, name, email, password } = req.body;
  return collect(
    requiredString(companyName, "companyName", 2),
    requiredString(name, "name", 2),
    requiredEmail(email),
    requiredString(password, "password", 8),
  );
}

export function createUserValidator(req) {
  const { name, email, password, role } = req.body;
  const errors = collect(
    requiredString(name, "name", 2),
    requiredEmail(email),
    requiredString(password, "password", 8),
  );
  if (role && !Object.values(ROLES).includes(role)) {
    errors.push("Invalid role");
  }
  return errors;
}
