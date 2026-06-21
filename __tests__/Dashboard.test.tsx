import React from "react";
import { render, screen } from "@testing-library/react";
import ActionableInsights from "../components/ui/ActionableInsights";
import { ActivityCategory } from "../types";
import '@testing-library/jest-dom';

describe("ActionableInsights Component", () => {
  it("renders nothing when activities are empty", () => {
    const { container } = render(<ActionableInsights activities={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders insights correctly", () => {
    const mockActivities = [
      {
        id: "1",
        type: "Drove 10 miles",
        category: "Transit" as ActivityCategory,
        carbonKg: 4.0,
        tip: "Take the bus",
      },
    ];

    render(<ActionableInsights activities={mockActivities} />);
    expect(screen.getByText("Actionable Insights")).toBeInTheDocument();
    expect(screen.getByText("Drove 10 miles")).toBeInTheDocument();
    expect(screen.getByText("Take the bus")).toBeInTheDocument();
    expect(screen.getByText("+4.0 kg")).toBeInTheDocument();
  });
});
