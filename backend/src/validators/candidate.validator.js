import { collect, optionalEmail, requiredString } from "./helpers.js";
import { CANDIDATE_STATUS } from "../utils/constants.js";

export function createCandidateValidator(req) {
  const errors = collect(
    requiredString(req.body.name, "name", 2),
    requiredString(req.body.phone, "phone", 6),
    optionalEmail(req.body.email),
  );
  if (req.body.status && !Object.values(CANDIDATE_STATUS).includes(req.body.status)) {
    errors.push("Invalid candidate status");
  }
  return errors;
}

export function updateCandidateValidator(req) {
  if (!req.body || Object.keys(req.body).length === 0) {
    return ["At least one field is required"];
  }
  const errors = collect(optionalEmail(req.body.email));
  if (req.body.status && !Object.values(CANDIDATE_STATUS).includes(req.body.status)) {
    errors.push("Invalid candidate status");
  }
  return errors;
}
