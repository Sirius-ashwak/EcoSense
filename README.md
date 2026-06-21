# EcoSense

EcoSense is an intelligent, NLP-driven carbon footprint awareness platform. Users can log their daily activities in natural language, and the platform will automatically parse, categorize, and calculate the estimated carbon emissions.

## Project Overview
**Vertical**: Carbon Footprint & Sustainability Awareness

This dashboard allows users to type entries such as "I drove 15 miles and left the AC on for 8 hours", which are parsed into individual activities. The application displays actionable insights, a total footprint, and a beautiful categorical breakdown using a donut chart.

## Approach and Logic
- **NLP Parsing**: The user's natural language string is sent to a Next.js API Route (`/api/parse`). We validate the incoming request using `zod` for strict type safety.
- **Mock NLP Logic**: Currently, the parser relies on a robust mock fallback that utilizes keyword and regex matching to accurately emulate an LLM's response. It detects keywords like "drove", "beef", "burger", and "ac", extracting quantitative values when possible.
- **Emission Calculations**: Activities are passed through `lib/emissionsCalculator.ts` which holds a static dictionary of emission factors (e.g., `gas_car_per_mile: 0.4 kg`).

## Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables:
   Copy `.env.example` to `.env.local`
   ```bash
   cp .env.example .env.local
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Run tests:
   ```bash
   npm test
   ```

## Assumptions Made
- We assumed generic emission baseline numbers (e.g. 0.4 kg CO2 per mile driven in a gas car, 3.0 kg per beef burger).
- For simplicity, the state is managed via React component state instead of an external database, meaning all activities clear upon a page refresh.
