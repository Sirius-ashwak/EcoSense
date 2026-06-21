import { calculateTotalEmissions, calculateBreakdown, getTreeEquivalency } from "../lib/emissionsCalculator";
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

    it("should handle negative inputs by summing exactly as passed", () => {
      const activities = [{ carbonKg: 10 }, { carbonKg: -5 }];
      expect(calculateTotalEmissions(activities)).toBe(5);
    });
  });

  describe("calculateBreakdown", () => {
    it("should return empty categories for no activities", () => {
      const result = calculateBreakdown([]);
      expect(result).toEqual({ Transit: 0, Diet: 0, Energy: 0, Shopping: 0, Waste: 0 });
    });

    it("should group emissions correctly by category", () => {
      const activities = [
        { category: "Transit" as ActivityCategory, carbonKg: 10 },
        { category: "Transit" as ActivityCategory, carbonKg: 5 },
        { category: "Diet" as ActivityCategory, carbonKg: 3 },
        { category: "Shopping" as ActivityCategory, carbonKg: 5 },
      ];
      const result = calculateBreakdown(activities);
      expect(result).toEqual({ Transit: 15, Diet: 3, Energy: 0, Shopping: 5, Waste: 0 });
    });

    it("should ignore unknown categories", () => {
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

    it("should calculate tree equivalency correctly", () => {
      const result = getTreeEquivalency(21.77);
      expect(result).toContain("1.00");
    });

    it("should handle small emissions", () => {
      const result = getTreeEquivalency(2);
      expect(result).toContain("0.09");
    });
  });
});
