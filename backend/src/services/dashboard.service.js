import candidateRepository from "../repositories/candidate.repository.js";
import callRepository from "../repositories/call.repository.js";
import followupRepository from "../repositories/followup.repository.js";
import leadRepository from "../repositories/lead.repository.js";
import clientRepository from "../repositories/client.repository.js";
import { CANDIDATE_STATUS, FOLLOWUP_STATUS } from "../utils/constants.js";

class DashboardService {
  async overview(companyId) {
    const [
      candidates,
      selected,
      rejected,
      calls,
      pendingFollowups,
      leads,
      clients,
    ] = await Promise.all([
      candidateRepository.count(companyId),
      candidateRepository.count(companyId, { status: CANDIDATE_STATUS.SELECTED }),
      candidateRepository.count(companyId, { status: CANDIDATE_STATUS.REJECTED }),
      callRepository.count(companyId),
      followupRepository.count(companyId, { status: FOLLOWUP_STATUS.PENDING }),
      leadRepository.count(companyId),
      clientRepository.count(companyId),
    ]);

    const conversionRate = candidates ? Number(((selected / candidates) * 100).toFixed(1)) : 0;

    return {
      candidates,
      selected,
      rejected,
      conversionRate,
      calls,
      pendingFollowups,
      leads,
      clients,
    };
  }
}

export default new DashboardService();
