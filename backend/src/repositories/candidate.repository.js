import Candidate from "../models/Candidate.js";
import { BaseRepository } from "./base.repository.js";

class CandidateRepository extends BaseRepository {
  constructor() {
    super(Candidate);
  }

  async search(companyId, { filter, skip, limit }) {
    const [items, total] = await Promise.all([
      this.findMany(companyId, filter, {
        skip,
        limit,
        populate: "assignedTo createdBy",
      }),
      this.count(companyId, filter),
    ]);
    return { items, total };
  }
}

export default new CandidateRepository();
