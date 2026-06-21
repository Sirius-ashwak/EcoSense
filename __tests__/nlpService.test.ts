import { parseNaturalLanguageInput } from "../lib/nlpService";

describe("nlpService", () => {
  it("should extract transit emissions and cap at reasonable defaults", () => {
    const result = parseNaturalLanguageInput("I drove 20 miles to work");
    expect(result.length).toBe(1);
    expect(result[0].category).toBe("Transit");
    expect(result[0].carbonKg).toBe(8); // 20 * 0.4
  });

  it("should detect high carbon diet (beef)", () => {
    const result = parseNaturalLanguageInput("I ate a beef burger for lunch");
    expect(result.length).toBe(1);
    expect(result[0].category).toBe("Diet");
    expect(result[0].carbonKg).toBe(3.0);
  });

  it("should detect medium carbon diet (chicken/fish)", () => {
    const result = parseNaturalLanguageInput("Had some grilled chicken");
    expect(result.length).toBe(1);
    expect(result[0].category).toBe("Diet");
    expect(result[0].carbonKg).toBe(1.5);
  });

  it("should extract energy emissions", () => {
    const result = parseNaturalLanguageInput("I left the AC on for 10 hours");
    expect(result.length).toBe(1);
    expect(result[0].category).toBe("Energy");
    expect(result[0].carbonKg).toBe(5); // 10 * 0.5
  });

  it("should return a fallback activity for unrecognized input", () => {
    const result = parseNaturalLanguageInput("I walked my dog and read a book");
    expect(result.length).toBe(1);
    expect(result[0].type).toBe("Unclassified Daily Activity");
    expect(result[0].carbonKg).toBe(1.0);
  });
});
