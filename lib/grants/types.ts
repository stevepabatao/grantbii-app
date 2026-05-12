export type Grant = {
  id: string
  name: string
  summary: string
  applicant_type: string[]
  employee_count_min: number
  employee_count_max: number | null
  revenue_band: string[]
  business_objectives: string[]
  requires_local_entity: boolean
  requires_new_market: boolean
  notes: string[]
}

export type BusinessProfile = {
  companyName: string
  applicantType: "sme" | "non_sme"
  industry: string
  employeeCount: number
  annualRevenue: number
  yearsOperating: number
  businessObjectives: string[]
  isLocalEntity: boolean
  expandingToNewMarket: boolean
}

export type Recommendation = {
  id: string
  name: string
  score: number
  eligible: boolean
  summary: string
  whyMatched: string[]
  concerns: string[]
  matchedObjectives: string[]
}