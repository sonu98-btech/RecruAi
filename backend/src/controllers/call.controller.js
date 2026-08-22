import callService from "../services/call.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createCall = asyncHandler(async (req, res) => {
  const data = await callService.create(req.user, req.tenant.companyId, req.body);
  return ApiResponse.created(res, { message: "Call created", data });
});

export const listCalls = asyncHandler(async (req, res) => {
  const data = await callService.list(req.tenant.companyId, req.query);
  return ApiResponse.success(res, { message: "Calls fetched", data });
});

export const getCall = asyncHandler(async (req, res) => {
  const data = await callService.get(req.tenant.companyId, req.params.id);
  return ApiResponse.success(res, { message: "Call fetched", data });
});

export const twilioStatusWebhook = asyncHandler(async (req, res) => {
  const data = await callService.applyTwilioStatus(req.body);
  return ApiResponse.success(res, { message: "Webhook processed", data });
});

export const twilioVoiceWebhook = asyncHandler(async (req, res) => {
  res.type("text/xml");
  res.send(`
    <Response>
      <Say voice="Polly.Olivia" language="en-US">
        Hello! I am RecruitAI's automated recruiter. I am calling to conduct a quick screening for the job role you applied to. Let's start. Please state your full name and summarize your professional experience after the beep. Press hash when you are finished.
      </Say>
      <Record
        action="/api/calls/webhooks/twilio/recording"
        method="POST"
        maxLength="60"
        finishOnKey="#"
        playBeep="true"
      />
      <Say voice="Polly.Olivia" language="en-US">
        Thank you. We did not receive your input. We will follow up via email. Goodbye.
      </Say>
    </Response>
  `);
});

export const twilioRecordingWebhook = asyncHandler(async (req, res) => {
  const data = await callService.applyTwilioRecording(req.body);
  res.type("text/xml");
  res.send(`
    <Response>
      <Say voice="Polly.Olivia" language="en-US">
        Thank you for your response. Our AI recruiter is analyzing your screening. We will get back to you soon. Goodbye!
      </Say>
      <Hangup />
    </Response>
  `);
});
