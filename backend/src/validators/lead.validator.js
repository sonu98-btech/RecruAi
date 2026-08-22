import { collect, optionalEmail, requiredString } from "./helpers.js";

export function createLeadValidator(req) {
  return collect(
    requiredString(req.body.name, "name", 2),
    requiredString(req.body.phone, "phone", 6),
    optionalEmail(req.body.email),
  );
}
