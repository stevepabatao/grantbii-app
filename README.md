# Grant Recommendation Engine

A lightweight grant recommendation application built for the Grantbii Software Engineering Assignment.

The application allows users to submit a business profile and receive ranked grant recommendations with explainable reasoning.

---

# Overview

This project implements a simplified recommendation system designed to evaluate business profiles against a grant dataset and surface the most relevant opportunities.

The solution focuses on:

- clear recommendation logic
- explainable matching
- maintainable architecture
- clean frontend/backend separation
- pragmatic engineering tradeoffs

---

# Tech Stack

## Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

## Backend
- Next.js Route Handlers
- TypeScript

---

# Features

- Business profile submission flow
- Ranked grant recommendations
- Weighted recommendation scoring
- Explainable recommendation reasoning
- Eligibility-aware filtering
- Responsive UI
- Shared frontend/backend typing

---

# Recommendation Approach

The recommendation engine uses a hybrid approach combining:

## 1. Hard Eligibility Constraints

Certain fields are treated as qualification requirements rather than ranking signals.

Examples:
- local entity requirements
- applicant type compatibility
- overseas expansion requirements

These constraints can fully disqualify grants where applicable.

---

## 2. Weighted Relevance Scoring

Remaining eligible grants are ranked using weighted scoring based on:
- business objective overlap
- applicant type alignment
- employee count suitability
- expansion goals
- local entity alignment

This approach was chosen because the dataset contains overlapping grant objectives and qualitative recommendation nuances.

---

# Explainability

Recommendations include:
- why the recommendation matched
- matched objectives
- potential considerations or caveats

The goal was to make recommendations interpretable rather than purely score-based.

---

# Project Structure

```txt
app/
├── api/
│   └── grants/
│       └── recommend/
│           └── route.ts

components/
├── business-profile-form.tsx
├── recommendations-panel.tsx

lib/
├── grants/
│   ├── dataset.ts
│   ├── explain.ts
│   ├── matcher.ts
│   ├── scorer.ts
│   ├── weights.ts
│
├── types.ts

data/
└── grants.json

# Running Locally

## Install dependencies

```bash
npm install
```

## Start development server

```bash
npm run dev
```

Application will run on:

```txt
http://localhost:3000
```

---

# Assumptions

- The provided dataset is intentionally simplified for the scope of the exercise.
- The original dataset structure was preserved as the source-of-truth input format.
- Lightweight internal normalization was used to improve type safety and recommendation consistency without materially changing dataset semantics.

---

# Tradeoffs & Design Decisions

## Why Next.js Fullstack?

For the scope of the assignment, using Next.js route handlers allowed:

- simplified local setup
- reduced operational complexity
- straightforward frontend/backend integration

while still preserving clear architectural separation.

---

## Why File-Based Data?

The assignment dataset is relatively small and static.

Using a file-based approach:

- reduced infrastructure complexity
- improved reviewer setup experience
- kept focus on recommendation logic rather than persistence concerns

---

## Why Weighted Recommendations Instead of Strict Filtering?

Several grants overlap in business objectives and transformation themes.

A weighted recommendation model better reflects:

- recommendation nuance
- strategic fit
- real-world ambiguity

while still preserving hard qualification requirements where appropriate.

---

# Potential Future Improvements

If extended further, possible improvements could include:

- configurable scoring weights
- admin-managed grant ingestion
- semantic search / vector retrieval
- recommendation feedback loops
- grant expiration handling
- more granular industry matching

These were intentionally excluded to keep the implementation appropriately scoped for the assignment.

---

# Notes

The project intentionally prioritizes:

- maintainability
- readability
- explainability
- engineering clarity

over feature breadth or infrastructure complexity.