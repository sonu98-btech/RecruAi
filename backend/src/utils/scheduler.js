import followupService from "../services/followup.service.js";
import { logger } from "./logger.js";

export function startFollowupScheduler() {
  const tick = async () => {
    try {
      const n = await followupService.dispatchDueReminders();
      if (n) logger.info(`Dispatched ${n} follow-up reminders`);
    } catch (error) {
      logger.error("Follow-up scheduler failed", error);
    }
  };

  tick();
  return setInterval(tick, 60_000);
}
