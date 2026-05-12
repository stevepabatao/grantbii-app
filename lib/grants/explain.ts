import { BusinessProfile, Grant } from "./types"

export function generateWhyMatched(
  business: BusinessProfile,
  grant: Grant,
  matchedObjectives: string[]
) {
  const reasons: string[] = []

  if (matchedObjectives.length > 0) {
    reasons.push(
      `Matches business objectives: ${matchedObjectives.join(", ")}`
    )
  }

  if (
    grant.applicant_type.includes(business.applicantType)
  ) {
    reasons.push(
      `Suitable for ${business.applicantType.toUpperCase()} businesses`
    )
  }

  if (grant.requires_new_market) {
    reasons.push(
      "Supports overseas expansion initiatives"
    )
  }

  reasons.push(...grant.notes.slice(0, 1))

  return reasons
}