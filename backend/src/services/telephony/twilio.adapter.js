import env from "../../config/env.js";
import { logger } from "../../utils/logger.js";

/**
 * Twilio adapter interface. Methods are no-ops until credentials exist.
 * Call service depends on this contract, not the Twilio SDK.
 */
class TwilioAdapter {
  isConfigured() {
    return Boolean(env.twilio.accountSid && env.twilio.authToken && env.twilio.phoneNumber);
  }

  async placeOutboundCall({ to, from, webhookUrl, statusCallback }) {
    if (!this.isConfigured()) {
      logger.info("Twilio not configured — recording local call intent", { to, from });
      return {
        provider: "manual",
        sid: `local_${Date.now()}`,
        status: "INITIATED",
        simulated: true,
      };
    }

    try {
      const twilioModule = await import("twilio");
      const client = twilioModule.default(env.twilio.accountSid, env.twilio.authToken);
      
      const host = env.twilio.webhookBaseUrl || "";
      const call = await client.calls.create({
        to,
        from: env.twilio.phoneNumber,
        url: host ? `${host}${webhookUrl}` : undefined,
        statusCallback: host ? `${host}${statusCallback}` : undefined,
      });

      logger.info("Twilio outbound call placed", { sid: call.sid });
      return {
        provider: "twilio",
        sid: call.sid,
        status: call.status,
        simulated: false,
      };
    } catch (e) {
      logger.warn("Twilio call failed, falling back to mock simulation", { error: e.message });
      return {
        provider: "twilio-fallback",
        sid: `failed_${Date.now()}`,
        status: "FAILED",
        simulated: true,
        error: e.message,
      };
    }
  }
}

export const twilioAdapter = new TwilioAdapter();
