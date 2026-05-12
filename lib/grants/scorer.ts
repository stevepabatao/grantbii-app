import { BusinessProfile, Grant } from "./types"
import { WEIGHTS } from "./weights"

export function calculateScore(
  business: BusinessProfile,
  grant: Grant
) {
  let score = 0

  const matchedObjectives =
    business.businessObjectives.filter((objective) =>
      grant.business_objectives.includes(objective)
    )

  if (matchedObjectives.length > 0) {
    score +=
      (matchedObjectives.length /
        business.businessObjectives.length) *
      WEIGHTS.objectives
  }

  if (
    grant.applicant_type.includes(business.applicantType)
  ) {
    score += WEIGHTS.applicantType
  }

  if (
    business.employeeCount >= grant.employee_count_min
  ) {
    score += WEIGHTS.employeeCount
  }

  if (
    grant.requires_new_market ===
    business.expandingToNewMarket
  ) {
    score += WEIGHTS.newMarket
  }

  if (
    grant.requires_local_entity ===
    business.isLocalEntity
  ) {
    score += WEIGHTS.localEntity
  }

  return {
    score: Math.round(score),
    matchedObjectives,
  }
}