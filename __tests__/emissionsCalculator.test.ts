import {
  calculateTotalEmissions,
  calculateBreakdown,
  getTreeEquivalency,
  getSeverityLevel,
  DAILY_AVERAGE_KG,
} from "../lib/emissionsCalculator";
import { ActivityCategory } from "../types";

describe("emissionsCalculator", () => {
  describe("calculateTotalEmissions", () => {
    it("should return 0 when there are no activities", () => {
      expect(calculateTotalEmissions([])).toBe(0);
    });

    it("should calculate total correctly", () => {
      const activities = [{ carbonKg: 10 }, { carbonKg: 5 }, { carbonKg: 2.5 }];
      expect(calculateTotalEmissions(activities)).toBe(17.5);
    });

    it("should handle a single activity", () => {
      expect(calculateTotalEmissions([{ carbonKg: 7.3 }])).toBe(7.3);
    });
  });

  describe("calculateBreakdown", () => {
    it("should return zero for all categories when empty", () => {
      const result = calculateBreakdown([]);
      expect(result).toEqual({ Transit: 0, Diet: 0, Energy: 0, Shopping: 0, Waste: 0 });
    });

    it("should group emissions correctly by category", () => {
      const activities = [
        { category: "Transit" as ActivityCategory, carbonKg: 10 },
        { category: "Transit" as ActivityCategory, carbonKg: 5 },
        { category: "Diet" as ActivityCategory, carbonKg: 3 },
        { category: "Shopping" as ActivityCategory, carbonKg: 5 },
        { category: "Waste" as ActivityCategory, carbonKg: 2.5 },
      ];
      const result = calculateBreakdown(activities);
      expect(result).toEqual({ Transit: 15, Diet: 3, Energy: 0, Shopping: 5, Waste: 2.5 });
    });

    it("should ignore unknown categories safely", () => {
      const activities = [
        { category: "Transit" as ActivityCategory, carbonKg: 10 },
        { category: "Unknown" as unknown as ActivityCategory, carbonKg: 5 },
      ];
      const result = calculateBreakdown(activities);
      expect(result).toEqual({ Transit: 10, Diet: 0, Energy: 0, Shopping: 0, Waste: 0 });
    });
  });

  describe("getTreeEquivalency", () => {
    it("should return a no-emissions message for zero", () => {
      expect(getTreeEquivalency(0)).toBe("No emissions to offset yet.");
    });

    it("should return no-emissions message for negative values", () => {
      expect(getTreeEquivalency(-5)).toBe("No emissions to offset yet.");
    });

    it("should calculate tree equivalency for exactly one tree-year", () => {
      const result = getTreeEquivalency(21.77);
      expect(result).toContain("1.00");
    });

    it("should handle small emissions", () => {
      const result = getTreeEquivalency(2);
      expect(result).toContain("0.09");
    });
  });

  describe("getSeverityLevel", () => {
    it("should return 'low' for small emissions", () => {
      expect(getSeverityLevel(1)).toBe("low");
    });

    it("should return 'moderate' for medium emissions", () => {
      expect(getSeverityLevel(DAILY_AVERAGE_KG * 0.5)).toBe("moderate");
    });

    it("should return 'high' for large emissions", () => {
      expect(getSeverityLevel(DAILY_AVERAGE_KG)).toBe("high");
    });

    it("should return 'low' for zero emissions", () => {
      expect(getSeverityLevel(0)).toBe("low");
    });
  });
});
