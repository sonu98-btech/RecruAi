import { voiceAiPipeline } from "./ai/pipeline.js";
import callService from "./call.service.js";

class AiService {
  async analyzeTranscript(transcript) {
    const { analysis, decision, pipeline } = await voiceAiPipeline.fromTranscript(transcript);
    return {
      summary: analysis.summary,
      sentiment: analysis.sentiment,
      candidateScore: analysis.candidateScore,
      recommendation: analysis.recommendation,
      decision,
      pipeline,
    };
  }

  async analyzeCallRecord(companyId, callId, transcript) {
    return callService.analyzeAndPersist(companyId, callId, transcript);
  }
}

export default new AiService();
