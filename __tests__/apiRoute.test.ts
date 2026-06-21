import { parseNaturalLanguageInput } from "../lib/nlpService";
import { NLPInputSchema } from "../types";

/**
 * Tests the full parse pipeline: Zod validation → NLP service → response.
 * Simulates what the API route does without needing the Next.js server runtime.
 */
describe("Parse Pipeline (Validation + NLP)", () => {
  it("should reject empty input via Zod validation", () => {
    const result = NLPInputSchema.safeParse({ text: "" });
    expect(result.success).toBe(false);
  });

  it("should reject too-short input", () => {
    const result = NLPInputSchema.safeParse({ text: "Hi" });
    expect(result.success).toBe(false);
  });

  it("should reject missing text field", () => {
    const result = NLPInputSchema.safeParse({ message: "hello" });
    expect(result.success).toBe(false);
  });

  it("should accept valid input and sanitize HTML", () => {
    const result = NLPInputSchema.safeParse({
      text: "I drove <script>alert('xss')</script> 10 miles",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.text).not.toContain("<script>");
      expect(result.data.text).toContain("10 miles");
    }
  });

  it("should parse valid transit input end-to-end", () => {
    const validation = NLPInputSchema.safeParse({ text: "I drove 10 miles today" });
    expect(validation.success).toBe(true);
    if (validation.success) {
      const activities = parseNaturalLanguageInput(validation.data.text);
      expect(activities.length).toBeGreaterThan(0);
      expect(activities[0]?.category).toBe("Transit");
    }
  });

  it("should detect multiple categories from complex input", () => {
    const validation = NLPInputSchema.safeParse({
      text: "Drove 20 miles, ate a steak, and threw away garbage",
    });
    expect(validation.success).toBe(true);
    if (validation.success) {
      const activities = parseNaturalLanguageInput(validation.data.text);
      const categories = activities.map((a) => a.category);
      expect(categories).toContain("Transit");
      expect(categories).toContain("Diet");
      expect(categories).toContain("Waste");
    }
  });

  it("should enforce maximum length", () => {
    const longText = "a".repeat(1001);
    const result = NLPInputSchema.safeParse({ text: longText });
    expect(result.success).toBe(false);
  });
});
