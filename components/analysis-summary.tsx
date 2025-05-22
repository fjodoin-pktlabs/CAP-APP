"use client"

import type { WhatIfAnalysisResult } from "@/types/graph-types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface AnalysisSummaryProps {
  data: WhatIfAnalysisResult
  onSelectPolicy: (id: string) => void
}

export function AnalysisSummary({ data, onSelectPolicy }: AnalysisSummaryProps) {
  const policies = data.value

  // Calculate summary statistics
  const totalPolicies = policies.length
  const enabledPolicies = policies.filter((p) => p.state === "enabled").length
  const appliesPolicies = policies.filter((p) => p.policyApplies).length
  const templatePolicies = policies.filter((p) => p.templateId).length

  // Group by analysis reasons
  const reasonsCount: Record<string, number> = {}
  policies.forEach((policy) => {
    const reason = policy.analysisReasons === "notSet" ? "N/A" : policy.analysisReasons
    reasonsCount[reason] = (reasonsCount[reason] || 0) + 1
  })

  const reasonsData = Object.entries(reasonsCount).map(([name, value]) => ({ name, value }))

  // Group by controls
  const controlsCount: Record<string, number> = {}
  policies.forEach((policy) => {
    if (policy.grantControls?.builtInControls) {
      policy.grantControls.builtInControls.forEach((control) => {
        controlsCount[control] = (controlsCount[control] || 0) + 1
      })
    }
  })

  const controlsData = Object.entries(controlsCount).map(([name, value]) => ({ name, value }))

  // Get policies that don't apply
  const nonApplyingPolicies = policies.filter((p) => !p.policyApplies)

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Policies</CardDescription>
            <CardTitle className="text-3xl">{totalPolicies}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {templatePolicies} from templates, {totalPolicies - templatePolicies} custom
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Enabled Policies</CardDescription>
            <CardTitle className="text-3xl">{enabledPolicies}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">{totalPolicies - enabledPolicies} disabled</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Policies That Apply</CardDescription>
            <CardTitle className="text-3xl">{appliesPolicies}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">{totalPolicies - appliesPolicies} don't apply</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Analysis Reasons</CardDescription>
            <CardTitle className="text-3xl">{Object.keys(reasonsCount).length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Unique reasons why policies apply or don't</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Analysis Reasons</CardTitle>
            <CardDescription>Why policies apply or don't apply</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={Object.fromEntries(
                reasonsData.map((item, index) => [
                  item.name,
                  {
                    label: item.name,
                    color: COLORS[index % COLORS.length],
                  },
                ]),
              )}
            >
              <BarChart data={reasonsData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-name)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Grant Controls</CardTitle>
            <CardDescription>Controls used in policies</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={controlsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {controlsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} policies`, "Count"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {nonApplyingPolicies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Policies That Don't Apply</CardTitle>
            <CardDescription>These policies are enabled but don't apply based on the analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nonApplyingPolicies.map((policy) => (
                <div key={policy.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-start">
                    <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium">{policy.displayName}</div>
                      <div className="text-sm text-muted-foreground">
                        Reason: {policy.analysisReasons === "notSet" ? "N/A" : policy.analysisReasons}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onSelectPolicy(policy.id)}>
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
