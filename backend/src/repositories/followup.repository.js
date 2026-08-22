import Followup from "../models/Followup.js";
import { BaseRepository } from "./base.repository.js";
import { FOLLOWUP_STATUS } from "../utils/constants.js";

class FollowupRepository extends BaseRepository {
  constructor() {
    super(Followup);
  }

  dueReminders(now = new Date()) {
    return Followup.find({
      status: FOLLOWUP_STATUS.PENDING,
      reminderDate: { $lte: now },
      reminderSentAt: { $exists: false },
    }).limit(100);
  }
}

export default new FollowupRepository();
