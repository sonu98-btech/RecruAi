import { collect, requiredString } from "./helpers.js";
import { CALL_TYPE } from "../utils/constants.js";

export function createCallValidator(req) {
  const errors = collect(requiredString(req.body.candidateId, "candidateId"));
  if (req.body.callType && !Object.values(CALL_TYPE).includes(req.body.callType)) {
    errors.push("Invalid callType");
  }
  return errors;
}

export function analyzeCallValidator(req) {
  return collect(requiredString(req.body.transcript, "transcript", 10, 20000));
}
