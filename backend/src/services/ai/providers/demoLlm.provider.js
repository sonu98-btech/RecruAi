/**
 * Demo LLM provider — keyword/heuristic analysis.
 * Swap this module for a local llama.cpp / Ollama client later.
 */
export class DemoLlmProvider {
  name = "demo";

  async analyzeTranscript(transcript) {
    const text = String(transcript || "").toLowerCase();

    const skillHits = [
      "react",
      "node",
      "javascript",
      "python",
      "java",
      "sql",
      "aws",
      "mongodb",
    ].filter((skill) => text.includes(skill));

    const yearsMatch = text.match(/(\d+)\s*(?:\+)?\s*(?:years|year|yrs)/);
    const years = yearsMatch ? Number(yearsMatch[1]) : 0;

    const salaryMatch = text.match(/(\d+(?:\.\d+)?)\s*(lpa|lakhs|ctc)/);
    const salary = salaryMatch ? Number(salaryMatch[1]) : null;

    const negative = ["not interested", "reject", "poor", "no experience", "unavailable"].some(
      (w) => text.includes(w),
    );
    const positive = ["interested", "excited", "available", "strong", "good"].some((w) =>
      text.includes(w),
    );

    let sentiment = "Neutral";
    if (negative && !positive) sentiment = "Negative";
    if (positive && !negative) sentiment = "Positive";

    let score = 50;
    score += Math.min(years, 8) * 4;
    score += skillHits.length * 6;
    if (sentiment === "Positive") score += 10;
    if (sentiment === "Negative") score -= 20;
    if (salary != null && salary > 25) score -= 5;
    score = Math.max(0, Math.min(100, score));

    const primarySkill = skillHits[0] ? skillHits[0][0].toUpperCase() + skillHits[0].slice(1) : "the";
    const summary = skillHits.length
      ? `Candidate is suitable for ${primarySkill} developer role`
      : "Candidate profile captured from call transcript; skills need clarification";

    let recommendation = "Schedule screening call";
    if (score >= 80) recommendation = "Schedule technical interview";
    else if (score >= 65) recommendation = "Proceed to recruiter screening";
    else if (score < 40) recommendation = "Do not proceed";

    return {
      summary,
      sentiment,
      candidateScore: score,
      recommendation,
      provider: this.name,
      analyzedAt: new Date(),
      features: { years, skills: skillHits, salary },
    };
  }
}
