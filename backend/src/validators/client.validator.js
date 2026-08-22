import { collect, optionalEmail, requiredString } from "./helpers.js";

export function createClientValidator(req) {
  return collect(
    requiredString(req.body.companyName, "companyName", 2),
    requiredString(req.body.contactPerson, "contactPerson", 2),
    optionalEmail(req.body.email),
  );
}
