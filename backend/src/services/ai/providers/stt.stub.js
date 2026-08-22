/**
 * Speech-to-text stub. Replace with Whisper / Deepgram / Twilio STT.
 */
export class StubSttProvider {
  name = "stub";

  async transcribe(_audioBufferOrUrl) {
    return {
      provider: this.name,
      transcript: "",
      note: "STT not configured. Pass transcript directly or plug in a local Whisper service.",
    };
  }
}
