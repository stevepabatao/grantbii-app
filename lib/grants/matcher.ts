import { BusinessProfile, Grant } from "./types"

export function checkEligibility(
  business: BusinessProfile,
  grant: Grant
) {
  const concerns: string[] = []

  if (
    grant.requires_local_entity &&
    !business.isLocalEntity
  ) {
    return {
      eligible: false,
      concerns: ["Requires local entity registration"],
    }
  }

  if (
    grant.requires_new_market &&
    !business.expandingToNewMarket
  ) {
    return {
      eligible: false,
      concerns: ["Grant is focused on overseas market expansion"],
    }
  }

  if (
    !grant.applicant_type.includes(
      business.applicantType
    )
  ) {
    return {
      eligible: false,
      concerns: [
        'Applicant type is not eligible for this programme',
      ],
    }
  }

  if (
    business.employeeCount < grant.employee_count_min
  ) {
    concerns.push(
      `Typically suited for companies with at least ${grant.employee_count_min} employees`
    )
  }

  return {
    eligible: true,
    concerns,
  }
}