# Recommendation API Route Documentation

File:

```txt
/app/api/grants/recommend/route.ts
```

---

# Purpose

This route acts as the core recommendation orchestration layer for the application.

It is responsible for:

- receiving the business profile
- loading the grant dataset
- applying hard eligibility filtering
- performing weighted recommendation scoring
- generating explainable recommendation reasoning
- ranking and limiting results
- returning structured recommendations to the frontend

The implementation intentionally separates:
- hard eligibility constraints
- softer recommendation relevance signals

to better reflect how real-world recommendation systems operate.

---

# Architectural Flow

```txt
Incoming Request
      ↓
Parse Business Profile
      ↓
Load Grants Dataset
      ↓
Eligibility Filtering
      ↓
Weighted Recommendation Scoring
      ↓
Low-Relevance Filtering
      ↓
Explainability Generation
      ↓
Ranking & Limiting
      ↓
JSON Response
```

---

# Imports

```ts
import { NextRequest, NextResponse } from 'next/server'
```

Used for handling API requests and responses using Next.js Route Handlers.

---

```ts
import { getGrants } from '@/lib/grants/dataset'
```

Loads the grant dataset from the local data source.

This abstraction allows the data layer to evolve independently in the future.

Potential upgrades:
- database integration
- external API ingestion
- CMS-backed grant management
- caching layer

---

```ts
import { checkEligibility } from '@/lib/grants/matcher'
```

Handles hard eligibility validation.

Responsibilities include:
- local entity requirements
- overseas expansion requirements
- applicant type compatibility

The matcher intentionally distinguishes:
- disqualifying constraints
vs
- softer recommendation signals

Potential upgrades:
- rule engine abstraction
- configurable policy evaluation
- dynamic constraint configuration

---

```ts
import { calculateScore } from '@/lib/grants/scorer'
```

Performs weighted recommendation scoring.

Current scoring factors may include:
- business objective overlap
- applicant type alignment
- employee count suitability
- market expansion alignment

This layer represents recommendation quality rather than strict qualification logic.

Potential upgrades:
- ML-assisted ranking
- vector similarity scoring
- semantic matching
- configurable scoring weights
- learning-to-rank systems

---

```ts
import { generateWhyMatched } from '@/lib/grants/explain'
```

Generates explainable recommendation reasoning.

This improves:
- recommendation transparency
- user trust
- recommendation interpretability

Potential upgrades:
- AI-generated summaries
- rationale templates
- confidence reasoning
- recommendation comparison insights

---

# Configuration

```ts
const MINIMUM_SCORE_THRESHOLD = 40
```

Defines the minimum recommendation score required for a grant to appear in results.

Purpose:
- suppress weak recommendations
- improve recommendation quality
- avoid overwhelming users

Potential upgrades:
- dynamic thresholds
- percentile-based filtering
- personalized confidence thresholds

---

```ts
const MAX_RECOMMENDATIONS = 5
```

Limits the number of surfaced recommendations.

Purpose:
- improve UX focus
- prioritize strongest matches
- prevent noisy outputs

Potential upgrades:
- pagination
- infinite scroll
- adaptive recommendation count

---

# POST Handler

```ts
export async function POST(req: NextRequest)
```

Main API entry point.

Receives:
- business profile payload

Returns:
- ranked recommendations
- explainability metadata
- recommendation confidence levels

---

# Step 1 — Parse Business Profile

```ts
const business = await req.json()
```

Extracts the submitted business profile from the request body.

Potential upgrades:
- request validation using Zod
- schema enforcement
- sanitization
- payload normalization

Recommended future improvement:

```ts
zod validation
```

to ensure:
- type safety
- reliable API contracts
- predictable scoring behavior

---

# Step 2 — Load Grants Dataset

```ts
const grants = getGrants()
```

Retrieves all grants from the dataset source.

Current implementation:
- file-based JSON loading

Chosen because:
- simplified assignment setup
- low operational complexity
- fast reviewer onboarding

Potential upgrades:
- PostgreSQL
- Prisma ORM
- Elasticsearch
- vector database
- admin-managed ingestion

---

# Step 3 — Hard Eligibility Filtering

```ts
const eligibility = checkEligibility(
  business,
  grant
)
```

Determines whether the grant is fundamentally compatible with the business profile.

Hard constraints are treated as:
- pass/fail qualification gates

Examples:
- local entity requirements
- overseas expansion requirements
- incompatible applicant types

This intentionally separates:
- qualification
from
- recommendation strength

This distinction mirrors real-world recommendation system design.

---

# Step 4 — Weighted Recommendation Scoring

```ts
const scoring = calculateScore(
  business,
  grant
)
```

Calculates recommendation relevance using weighted business alignment signals.

Unlike eligibility filtering, scoring represents:
- suitability
- strategic fit
- recommendation confidence

This enables:
- nuanced ranking
- partial compatibility handling
- explainable recommendation tradeoffs

Example soft signals:
- employee count thresholds
- objective overlap
- expansion alignment

---

# Step 5 — Low-Relevance Filtering

```ts
if (
  scoring.score <
  MINIMUM_SCORE_THRESHOLD
)
```

Suppresses weak recommendation matches.

Purpose:
- avoid noisy recommendations
- improve recommendation quality
- increase trustworthiness

This prevents the engine from surfacing grants with minimal relevance.

---

# Step 6 — Explainability Generation

```ts
const whyMatched =
  generateWhyMatched(
    business,
    grant,
    scoring.matchedObjectives
  )
```

Creates human-readable recommendation reasoning.

Explainability is intentionally treated as:
- a core product feature
rather than
- a debugging aid

This supports:
- recommendation transparency
- trust
- interpretability
- ambiguity handling

---

# Step 7 — Confidence Classification

```ts
const matchStrength =
  getMatchStrength(
    scoring.score
  )
```

Converts numeric scores into user-friendly confidence labels.

Current categories:
- Strong Fit
- Good Fit
- Possible Fit
- Weak Fit

Purpose:
- improve recommendation readability
- reduce cognitive load
- provide confidence framing

Potential upgrades:
- percentile scoring
- calibrated confidence
- AI-generated confidence explanations

---

# Step 8 — Recommendation Assembly

```ts
return {
  id: grant.id,
  name: grant.name,
  score: scoring.score,
  matchStrength,
  eligible: true,
  summary: grant.summary,
  whyMatched,
  concerns: eligibility.concerns,
  matchedObjectives:
    scoring.matchedObjectives,
}
```

Builds the final recommendation object returned to the frontend.

The response intentionally includes:
- recommendation score
- explainability
- concerns/caveats
- matched objectives
- confidence classification

to support:
- transparency
- user trust
- interpretability

---

# Step 9 — Null Removal

```ts
.filter(Boolean)
```

Removes grants rejected during:
- eligibility filtering
- score threshold filtering

---

# Step 10 — Ranking

```ts
.sort(
  (a, b) => b!.score - a!.score
)
```

Sorts recommendations by descending relevance score.

Highest-confidence recommendations appear first.

Potential upgrades:
- diversity-aware ranking
- novelty balancing
- recency weighting
- personalization

---

# Step 11 — Recommendation Limiting

```ts
.slice(0, MAX_RECOMMENDATIONS)
```

Limits the final recommendation set.

Purpose:
- reduce UI overload
- prioritize strongest recommendations
- improve recommendation quality perception

---

# Response Structure

```ts
return NextResponse.json({
  recommendations,
  total: recommendations.length,
})
```

Returns:
- recommendation list
- recommendation count

Potential upgrades:
- pagination metadata
- recommendation diagnostics
- scoring breakdowns
- API versioning

---

# Error Handling

```ts
catch (error)
```

Handles unexpected runtime failures.

Returns:
- HTTP 500 response
- generic error message

Potential upgrades:
- structured logging
- Sentry integration
- observability tooling
- retry mechanisms
- request tracing

---

# Match Strength Utility

```ts
function getMatchStrength(
  score: number
)
```

Maps numeric recommendation scores into human-readable confidence categories.

Purpose:
- improve recommendation interpretability
- make scores easier to understand
- provide clearer UX communication

Potential upgrades:
- adaptive confidence calibration
- percentile-based confidence
- explainable AI confidence models

---

# Design Philosophy

This implementation intentionally models the recommendation engine as:

```txt
recommendation system
```

rather than:

```txt
rigid rules engine
```

Key distinctions include:

- separating hard qualification from softer relevance
- allowing imperfect but valuable recommendations
- surfacing ambiguity through explainability
- prioritizing trust and interpretability

The architecture aims to balance:
- deterministic recommendation logic
- maintainability
- explainability
- realistic product behavior

while remaining appropriately scoped for the assignment.

---

# Potential Future Improvements

## Data Layer
- PostgreSQL + Prisma
- grant ingestion pipelines
- CMS integration

## Recommendation Engine
- semantic embeddings
- vector search
- hybrid ranking
- personalization

## Explainability
- AI-generated rationale
- recommendation comparison
- confidence decomposition

## Infrastructure
- Redis caching
- observability tooling
- analytics
- event-driven pipelines

## Product Experience
- recommendation feedback loops
- saved recommendations
- recommendation history
- grant application tracking
- recommendation tuning