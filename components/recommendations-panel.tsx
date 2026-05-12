'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

import { Recommendation } from '@/lib/grants/types'

interface Props {
  recommendations: Recommendation[]
  isLoading: boolean
}

export function RecommendationsPanel({
  recommendations,
  isLoading,
}: Props) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>

        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="p-6 space-y-4 border border-border"
          >
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />

            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  const hasResults =
    recommendations.length > 0

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">
          Recommended Grants
        </h2>

        <p className="text-sm text-muted-foreground mt-2">
          {hasResults
            ? `Showing ${recommendations.length} matching opportunities`
            : 'Complete your business profile to discover matching grants'}
        </p>
      </div>

      {!hasResults ? (
        <Card className="p-12 text-center border border-border rounded-lg">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">
              No Recommendations Yet
            </h3>

            <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
              Complete your business profile
              to discover grants aligned
              with your business goals and
              transformation initiatives.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-5">
          {recommendations.map((grant) => (
            <GrantCard
              key={grant.id}
              grant={grant}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function GrantCard({
  grant,
}: {
  grant: Recommendation
}) {
  return (
    <Card className="p-7 border border-border hover:shadow-md transition-shadow rounded-lg">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold tracking-tight">
              {grant.name}
            </h3>
          </div>

          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10">
              <div className="text-center">
                <div className="text-xl font-bold text-primary">
                  {grant.score}%
                </div>

                <div className="text-[10px] text-muted-foreground">
                  {getMatchStrength(
                    grant.score
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {grant.summary}
        </p>

        {/* Why Matched */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-3">
            Why This Matches
          </h4>

          <ul className="space-y-2">
            {grant.whyMatched.map(
              (reason, index) => (
                <li
                  key={index}
                  className="text-sm text-muted-foreground"
                >
                  • {reason}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Concerns */}
        {grant.concerns.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3">
              Potential Considerations
            </h4>

            <ul className="space-y-2">
              {grant.concerns.map(
                (concern, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground"
                  >
                    • {concern}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        {/* Objectives */}
        <div className="flex flex-wrap gap-2 pt-1">
          {grant.matchedObjectives.map(
            (objective) => (
              <Badge
                key={objective}
                variant="secondary"
                className="text-xs capitalize"
              >
                {objective.replaceAll(
                  '_',
                  ' '
                )}
              </Badge>
            )
          )}
        </div>
      </div>
    </Card>
  )
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