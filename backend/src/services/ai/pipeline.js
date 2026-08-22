import env from "../../config/env.js";
import { DemoLlmProvider } from "./providers/demoLlm.provider.js";
import { StubSttProvider } from "./providers/stt.stub.js";
import { StubTtsProvider } from "./providers/tts.stub.js";
import { decideFromAnalysis } from "./decisionEngine.js";

/**
 * Production pipeline (providers are swappable):
 * Audio → STT → LLM → Decision Engine → (optional) TTS → CRM update
 */
class VoiceAiPipeline {
  constructor() {
    this.stt = new StubSttProvider();
    this.llm = new DemoLlmProvider();
    this.tts = new StubTtsProvider();
  }

  async fromTranscript(transcript) {
    const analysis = await this.llm.analyzeTranscript(transcript);
    const decision = decideFromAnalysis(analysis);
    return {
      analysis: {
        summary: analysis.summary,
        sentiment: analysis.sentiment,
        candidateScore: analysis.candidateScore,
        recommendation: analysis.recommendation,
        analyzedAt: analysis.analyzedAt,
        provider: analysis.provider,
      },
      decision,
      pipeline: {
        stt: env.ai.sttProvider,
        llm: env.ai.llmProvider,
        tts: env.ai.ttsProvider,
      },
    };
  }

  async fromAudio(audio) {
    const stt = await this.stt.transcribe(audio);
    if (!stt.transcript) {
      return { stt, analysis: null, decision: null };
    }
    const result = await this.fromTranscript(stt.transcript);
    return { stt, ...result };
  }
}

export const voiceAiPipeline = new VoiceAiPipeline();
