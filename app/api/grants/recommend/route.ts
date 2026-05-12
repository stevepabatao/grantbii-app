import { NextRequest, NextResponse } from "next/server"

import { getGrants } from "@/lib/grants/dataset"
import { checkEligibility } from "@/lib/grants/matcher"
import { calculateScore } from "@/lib/grants/scorer"
import { generateWhyMatched } from "@/lib/grants/explain"

export async function POST(req: NextRequest) {
  try {
    console.log('API HIT')
    const business = await req.json()

    const grants = getGrants()

    const recommendations = grants
      .map((grant) => {
        const eligibility = checkEligibility(
          business,
          grant
        )

        if (!eligibility.eligible) {
          return null
        }

        const scoring = calculateScore(
          business,
          grant
        )

        const whyMatched = generateWhyMatched(
          business,
          grant,
          scoring.matchedObjectives
        )

        return {
          id: grant.id,
          name: grant.name,
          score: scoring.score,
          eligible: true,
          summary: grant.summary,
          whyMatched,
          concerns: eligibility.concerns,
          matchedObjectives:
            scoring.matchedObjectives,
        }
      })
      .filter(Boolean)
      .sort((a, b) => b!.score - a!.score)

    return NextResponse.json({
      recommendations,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: "Failed to generate recommendations",
      },
      {
        status: 500,
      }
    )
  }
}