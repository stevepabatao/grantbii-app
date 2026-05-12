'use client'

import { useState } from 'react'

import { BusinessProfileForm } from '@/components/business-profile-form'
import { RecommendationsPanel } from '@/components/recommendations-panel'

import { Recommendation } from '@/lib/grants/types'

export default function Page() {
  const [recommendations, setRecommendations] =
    useState<Recommendation[]>([])

  const [isLoading, setIsLoading] =
    useState(false)

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Grant Recommendation Engine
          </h1>

          <p className="text-base text-muted-foreground">
            Discover grants tailored to your
            business needs. Complete your
            profile to get personalized
            recommendations.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <div className="flex-1">
            <BusinessProfileForm
              isLoading={isLoading}
              setRecommendations={setRecommendations}
              setIsLoading={setIsLoading}
            />
          </div>

          {/* Recommendations */}
          <div className="flex-1">
            <RecommendationsPanel
              recommendations={
                recommendations
              }
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
