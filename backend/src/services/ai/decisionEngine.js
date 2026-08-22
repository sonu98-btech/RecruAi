import { CANDIDATE_STATUS } from "../../utils/constants.js";

/**
 * Maps LLM output to CRM actions without writing to the database.
 * The call/candidate services apply these decisions explicitly.
 */
export function decideFromAnalysis(analysis) {
  const score = analysis.candidateScore ?? 0;
  const nextStatus =
    score >= 80
      ? CANDIDATE_STATUS.INTERVIEW
      : score >= 55
        ? CANDIDATE_STATUS.SCREENING
        : score < 40
          ? CANDIDATE_STATUS.REJECTED
          : CANDIDATE_STATUS.NEW;

  return {
    nextStatus,
    shouldCreateFollowup: score >= 55,
    followupTask:
      score >= 80 ? "Schedule technical interview" : "Complete recruiter screening",
  };
}
