import { parseNaturalLanguageInput } from "../lib/nlpService";

describe("nlpService — Smart Activity Parser", () => {
  describe("Transit Detection", () => {
    it("should extract transit emissions with mileage", () => {
      const result = parseNaturalLanguageInput("I drove 20 miles to work");
      expect(result.length).toBe(1);
      expect(result[0].category).toBe("Transit");
      expect(result[0].carbonKg).toBe(8); // 20 * 0.4
    });

    it("should detect flight activities", () => {
      const result = parseNaturalLanguageInput("I flew for 3 hours");
      expect(result.length).toBe(1);
      expect(result[0].category).toBe("Transit");
      expect(result[0].carbonKg).toBe(270); // 3 * 90
    });

    it("should detect uber/taxi", () => {
      const result = parseNaturalLanguageInput("Took an uber for 5 miles");
      expect(result.length).toBe(1);
      expect(result[0].category).toBe("Transit");
    });
  });

  describe("Diet Detection", () => {
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

    it("should detect low carbon diet (vegan/plant-based)", () => {
      const result = parseNaturalLanguageInput("Had a vegan salad for dinner");
      expect(result.length).toBe(1);
      expect(result[0].category).toBe("Diet");
      expect(result[0].carbonKg).toBe(0.5);
    });
  });

  describe("Energy Detection", () => {
    it("should extract energy emissions from AC usage", () => {
      const result = parseNaturalLanguageInput("I left the AC on for 10 hours");
      expect(result.length).toBe(1);
      expect(result[0].category).toBe("Energy");
      expect(result[0].carbonKg).toBe(5); // 10 * 0.5
    });

    it("should detect lights", () => {
      const result = parseNaturalLanguageInput("Left the lights on for 8 hours");
      expect(result.length).toBe(1);
      expect(result[0].category).toBe("Energy");
    });
  });

  describe("Shopping Detection", () => {
    it("should detect clothing purchases", () => {
      const result = parseNaturalLanguageInput("I bought a new shirt today");
      expect(result.length).toBe(1);
      expect(result[0].category).toBe("Shopping");
      expect(result[0].carbonKg).toBe(5.0);
    });

    it("should detect electronics purchases", () => {
      const result = parseNaturalLanguageInput("I ordered a new laptop");
      expect(result.length).toBe(1);
      expect(result[0].category).toBe("Shopping");
      expect(result[0].carbonKg).toBe(20.0);
    });
  });

  describe("Waste Detection", () => {
    it("should detect waste generation", () => {
      const result = parseNaturalLanguageInput("I threw away a bag of trash");
      expect(result.length).toBe(1);
      expect(result[0].category).toBe("Waste");
      expect(result[0].carbonKg).toBe(2.5);
    });
  });

  describe("Multi-Activity Detection", () => {
    it("should detect multiple activities from a single sentence", () => {
      const result = parseNaturalLanguageInput(
        "I drove 10 miles, ate a beef burger, and left the AC on for 4 hours"
      );
      expect(result.length).toBe(3);
      const categories = result.map((a) => a.category);
      expect(categories).toContain("Transit");
      expect(categories).toContain("Diet");
      expect(categories).toContain("Energy");
    });
  });

  describe("Fallback Behavior", () => {
    it("should return a fallback activity for unrecognized input", () => {
      const result = parseNaturalLanguageInput("I walked my dog and read a book");
      expect(result.length).toBe(1);
      expect(result[0].type).toBe("Unrecognized Activity");
      expect(result[0].carbonKg).toBe(1.0);
    });
  });
});
