'use client'

import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'

import {
  BusinessProfile,
  Recommendation,
} from '@/lib/grants/types'

interface Props {
  recommendations?: Recommendation[]

  isLoading: boolean

  setRecommendations: (
    recommendations: Recommendation[]
  ) => void

  setIsLoading: (loading: boolean) => void
}

const INDUSTRIES = [
  'technology',
  'manufacturing',
  'healthcare',
  'education',
  'retail',
  'agriculture',
  'energy',
  'finance',
  'hospitality',
  'transportation',
  'other',
]

const BUSINESS_OBJECTIVES = [
  'automation',
  'process_improvement',
  'productivity',
  'operational_efficiency',
  'overseas_expansion',
  'market_entry',
  'business_development',
  'innovation',
  'commercialization',
  'r&d',
  'training',
  'digital_transformation',
]

export function BusinessProfileForm({
  isLoading,
  setRecommendations,
  setIsLoading,
}: Props) {
  
  const [formData, setFormData] =
    useState<BusinessProfile>({
      companyName: '',
      applicantType: 'sme',
      industry: '',
      employeeCount: 0,
      annualRevenue: 0,
      yearsOperating: 0,
      businessObjectives: [],
      isLocalEntity: true,
      expandingToNewMarket: false,
    })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'employeeCount' ||
          name === 'annualRevenue' ||
          name === 'yearsOperating'
          ? Number(value)
          : value,
    }))
  }

  const handleIndustryChange = (
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      industry: value,
    }))
  }

  const handleApplicantTypeChange = (
    value: 'sme' | 'non_sme'
  ) => {
    setFormData((prev) => ({
      ...prev,
      applicantType: value,
    }))
  }

  const handleObjectiveToggle = (
    objective: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      businessObjectives:
        prev.businessObjectives.includes(
          objective
        )
          ? prev.businessObjectives.filter(
            (obj) => obj !== objective
          )
          : [
            ...prev.businessObjectives,
            objective,
          ],
    }))
  }

  const handleCheckboxChange = (
    name:
      | 'isLocalEntity'
      | 'expandingToNewMarket',
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      const response = await fetch(
        '/api/grants/recommend',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify(formData),
        }
      )

      if (!response.ok) {
        throw new Error(
          'Failed to fetch recommendations'
        )
      }

      const data = await response.json()

      setRecommendations(
        data.recommendations || []
      )
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid =
    formData.companyName &&
    formData.industry &&
    formData.employeeCount > 0 &&
    formData.yearsOperating >= 0 &&
    formData.businessObjectives.length > 0

  return (
    <Card className="p-8 shadow-sm border border-border bg-card rounded-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">
          Business Profile
        </h2>

        <p className="text-sm text-muted-foreground mt-2">
          Tell us about your business to find
          matching grants
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="companyName">
            Company Name
          </Label>

          <Input
            id="companyName"
            name="companyName"
            placeholder="Acme Technologies"
            value={formData.companyName}
            onChange={handleInputChange}
          />
        </div>

        {/* Applicant Type */}
        <div className="space-y-2">
          <Label>Applicant Type</Label>

          <Select
            value={formData.applicantType}
            onValueChange={
              handleApplicantTypeChange
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="sme">
                SME
              </SelectItem>

              <SelectItem value="non_sme">
                Non-SME
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Industry */}
        <div className="space-y-2">
          <Label>Industry</Label>

          <Select
            value={formData.industry}
            onValueChange={
              handleIndustryChange
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>

            <SelectContent>
              {INDUSTRIES.map((industry) => (
                <SelectItem
                  key={industry}
                  value={industry}
                >
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Employee Count */}
        <div className="space-y-2">
          <Label htmlFor="employeeCount">
            Employee Count
          </Label>

          <Input
            id="employeeCount"
            name="employeeCount"
            type="number"
            value={
              formData.employeeCount || ''
            }
            onChange={handleInputChange}
          />
        </div>

        {/* Annual Revenue */}
        <div className="space-y-2">
          <Label htmlFor="annualRevenue">
            Annual Revenue
          </Label>

          <Input
            id="annualRevenue"
            name="annualRevenue"
            type="number"
            value={
              formData.annualRevenue || ''
            }
            onChange={handleInputChange}
          />
        </div>

        {/* Years Operating */}
        <div className="space-y-2">
          <Label htmlFor="yearsOperating">
            Years Operating
          </Label>

          <Input
            id="yearsOperating"
            name="yearsOperating"
            type="number"
            value={
              formData.yearsOperating || ''
            }
            onChange={handleInputChange}
          />
        </div>

        {/* Objectives */}
        <div className="space-y-3">
          <Label>
            Business Objectives
          </Label>

          <div className="space-y-2">
            {BUSINESS_OBJECTIVES.map(
              (objective) => (
                <div
                  key={objective}
                  className="flex items-center gap-3"
                >
                  <Checkbox
                    checked={formData.businessObjectives.includes(
                      objective
                    )}
                    onCheckedChange={() =>
                      handleObjectiveToggle(
                        objective
                      )
                    }
                  />

                  <Label className="font-normal capitalize">
                    {objective.replaceAll(
                      '_',
                      ' '
                    )}
                  </Label>
                </div>
              )
            )}
          </div>
        </div>

        {/* Local Entity */}
        <div className="flex items-center gap-3">
          <Checkbox
            checked={formData.isLocalEntity}
            onCheckedChange={(checked) =>
              handleCheckboxChange(
                'isLocalEntity',
                checked as boolean
              )
            }
          />

          <Label className="font-normal">
            Is this a local entity?
          </Label>
        </div>

        {/* New Market */}
        <div className="flex items-center gap-3">
          <Checkbox
            checked={
              formData.expandingToNewMarket
            }
            onCheckedChange={(checked) =>
              handleCheckboxChange(
                'expandingToNewMarket',
                checked as boolean
              )
            }
          />

          <Label className="font-normal">
            Expanding to a new market?
          </Label>
        </div>

        <Button
          type="submit"
          disabled={!isFormValid}
          className="w-full"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Spinner className="h-4 w-4" />
              <span>
                Finding Matching Grants...
              </span>
            </div>
          ) : (
            'Find Matching Grants'
          )}
        </Button>
      </form>
    </Card>
  )
}
