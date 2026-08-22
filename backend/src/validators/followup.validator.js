import { collect, requiredString } from "./helpers.js";

export function createFollowupValidator(req) {
  return collect(
    requiredString(req.body.candidateId, "candidateId"),
    requiredString(req.body.assignedTo, "assignedTo"),
    requiredString(req.body.task, "task", 3),
    requiredString(String(req.body.reminderDate || ""), "reminderDate"),
  );
}

export function createCampaignValidator(req) {
  return collect(requiredString(req.body.name, "name", 2));
}
