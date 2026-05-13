import { NextRequest, NextResponse } from 'next/server'

import { getGrants } from '@/lib/grants/dataset'
import { checkEligibility } from '@/lib/grants/matcher'
import { calculateScore } from '@/lib/grants/scorer'
import { generateWhyMatched } from '@/lib/grants/explain'

const MINIMUM_SCORE_THRESHOLD = 40
const MAX_RECOMMENDATIONS = 5

export async function POST(
  req: NextRequest
) {
  try {
    console.log(
      'Grant recommendation request received'
    )

    const business = await req.json()

    console.log(
      'Business Profile:',
      business
    )

    const grants = getGrants()

    const recommendations = grants
      .map((grant) => {
        /**
         * Step 1:
         * Hard eligibility filtering
         */
        const eligibility =
          checkEligibility(
            business,
            grant
          )

        if (!eligibility.eligible) {
          console.log(
            `Grant rejected: ${grant.name}`
          )

          return null
        }

        /**
         * Step 2:
         * Weighted recommendation scoring
         */
        const scoring =
          calculateScore(
            business,
            grant
          )

        /**
         * Step 3:
         * Filter low-quality matches
         */
        if (
          scoring.score <
          MINIMUM_SCORE_THRESHOLD
        ) {
          console.log(
            `Grant below threshold: ${grant.name} (${scoring.score})`
          )

          return null
        }

        /**
         * Step 4:
         * Generate explainability
         */
        const whyMatched =
          generateWhyMatched(
            business,
            grant,
            scoring.matchedObjectives
          )

        /**
         * Step 5:
         * Confidence label
         */
        const matchStrength =
          getMatchStrength(
            scoring.score
          )

        console.log({
          grant: grant.name,
          score: scoring.score,
          matchedObjectives:
            scoring.matchedObjectives,
        })

        return {
          id: grant.id,

          name: grant.name,

          score: scoring.score,

          matchStrength,

          eligible: true,

          summary: grant.summary,

          whyMatched,

          concerns:
            eligibility.concerns,

          matchedObjectives:
            scoring.matchedObjectives,
        }
      })

      /**
       * Remove nulls
       */
      .filter(Boolean)

      /**
       * Highest relevance first
       */
      .sort(
        (a, b) => b!.score - a!.score
      )

      /**
       * Limit final recommendations
       */
      .slice(0, MAX_RECOMMENDATIONS)

    console.log(
      'Final Recommendations:',
      recommendations
    )

    return NextResponse.json({
      recommendations,
      total: recommendations.length,
    })
  } catch (error) {
    console.error(
      'Recommendation Engine Error:',
      error
    )

    return NextResponse.json(
      {
        error:
          'Failed to generate recommendations',
      },
      {
        status: 500,
      }
    )
  }
}

function getMatchStrength(
  score: number
) {
  if (score >= 90) {
    return 'Strong Fit'
  }

  if (score >= 75) {
    return 'Good Fit'
  }

  if (score >= 50) {
    return 'Possible Fit'
  }

  return 'Weak Fit'
}