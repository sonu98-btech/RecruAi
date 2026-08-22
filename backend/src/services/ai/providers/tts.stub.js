/**
 * Text-to-speech stub. Replace with local Coqui / Piper / cloud TTS.
 */
export class StubTtsProvider {
  name = "stub";

  async synthesize(_text) {
    return {
      provider: this.name,
      audioUrl: null,
      note: "TTS not configured. Wire a local TTS engine for live agent voice.",
    };
  }
}
