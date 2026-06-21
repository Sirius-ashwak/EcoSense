# EcoSense

EcoSense is an intelligent, NLP-driven carbon footprint awareness platform. Users can log their daily activities in natural language, and the AI-powered assistant will automatically parse, categorize, and calculate the estimated carbon emissions — providing personalized, actionable sustainability tips.

## Project Overview

**Vertical**: Carbon Footprint & Sustainability Awareness

This dashboard allows users to type entries such as *"I drove 15 miles, ate a beef burger, bought a new shirt, and left the AC on for 8 hours"*, which are parsed into individual activities across **5 emission categories** (Transit, Diet, Energy, Shopping, Waste). The application displays actionable insights, a total footprint, a tree-offset equivalency, and a categorical breakdown via a donut chart.

## Smart Assistant Persona

EcoSense acts as a **context-aware sustainability advisor** that:

1. **Understands intent** — Detects multiple activities from a single natural-language sentence using regex-based NLP patterns.
2. **Makes logical decisions** — Differentiates between high-carbon (beef: 3.0 kg), medium-carbon (chicken: 1.5 kg), and low-carbon (vegan: 0.5 kg) meals, applying the appropriate emission factor.
3. **Provides real-world context** — Converts total emissions into tree-year equivalencies so users understand the environmental impact intuitively.
4. **Gives personalized tips** — Each detected activity includes a tailored recommendation (e.g., "Swapping one beef meal per week saves ~156 kg CO2/year").
5. **Handles ambiguity gracefully** — Unrecognized input triggers a helpful fallback with guidance on supported keywords.

## Approach and Logic

- **NLP Parsing**: User input is sent to a Next.js API Route (`/api/parse`). The request is validated and sanitized using `zod` (including HTML tag stripping for XSS prevention).
- **Smart NLP Service**: The core parser (`lib/nlpService.ts`) uses category-specific regex patterns to detect Transit (driving, flights, uber), Diet (beef, chicken, vegan), Energy (AC, lights), Shopping (clothing, electronics), and Waste activities — extracting quantitative values (miles, hours) when present.
- **Emission Calculations**: Activities are processed through `lib/emissionsCalculator.ts`, which holds evidence-based emission factors sourced from EPA and DEFRA data.
- **Tree Equivalency**: Total emissions are converted to tree-year offsets using the EPA figure of 21.77 kg CO2 absorbed per tree per year.
- **Efficiency**: The heavy `recharts` library is dynamically imported via `next/dynamic` with a Suspense fallback. All UI components are wrapped in `React.memo`, and event handlers use `useCallback` to prevent unnecessary re-renders.
- **Accessibility**: Implements skip-to-content navigation, `aria-live` regions for dynamic updates, `aria-describedby` for form hints, `role="alert"` for errors, and focus management after form submission.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (Strict Mode) |
| Styling | Tailwind CSS 4 |
| Charts | Recharts |
| Validation | Zod |
| Icons | lucide-react |
| Testing | Jest + React Testing Library |

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Run tests:
   ```bash
   npm test
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
├── app/
│   ├── api/parse/route.ts    # Secure API endpoint with Zod validation
│   ├── layout.tsx            # Root layout with SEO metadata
│   ├── page.tsx              # Main dashboard (state management)
│   └── globals.css           # Tailwind CSS imports
├── components/ui/
│   ├── ActivityInput.tsx     # NL input form with accessibility
│   ├── ActionableInsights.tsx# Activity cards with tips
│   ├── EmissionsChart.tsx    # Recharts donut chart
│   └── EmissionsDashboard.tsx# Total + chart wrapper
├── lib/
│   ├── emissionsCalculator.ts# Emission factors & calculations
│   └── nlpService.ts         # Smart NLP activity parser
├── types/
│   └── index.ts              # TypeScript interfaces & Zod schemas
└── __tests__/                # Jest test suites
```

## Assumptions Made

- Emission factors are based on EPA and DEFRA averages (e.g., 0.4 kg CO2/mile for gas cars, 3.0 kg/beef meal).
- State is managed via React component state (no external database); activities clear on page refresh.
- The NLP parser uses pattern matching as a stable, secure alternative to live LLM API calls.
