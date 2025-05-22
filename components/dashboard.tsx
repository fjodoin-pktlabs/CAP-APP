"use client"

import { useState } from "react"
import { ArrowLeft, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { WhatIfAnalysisResult } from "@/types/graph-types"
import { PoliciesTable } from "@/components/policies-table"
import { PolicyDetails } from "@/components/policy-details"
import { AnalysisSummary } from "@/components/analysis-summary"

interface DashboardProps {
  data: WhatIfAnalysisResult
  onReset: () => void
}

export function Dashboard({ data, onReset }: DashboardProps) {
  // Add this at the beginning of the Dashboard function
  console.log("Dashboard rendering with data:", {
    dataContext: data["@odata.context"],
    policiesCount: data.value.length,
    firstPolicy: data.value[0]
      ? {
          id: data.value[0].id,
          displayName: data.value[0].displayName,
          state: data.value[0].state,
        }
      : null,
  })

  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null)

  const handleExportJson = () => {
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = "graph-analysis-export.json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const selectedPolicy = selectedPolicyId ? data.value.find((policy) => policy.id === selectedPolicyId) : null

  if (selectedPolicy) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" onClick={() => setSelectedPolicyId(null)} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">Policy Details</h2>
        </div>
        <PolicyDetails policy={selectedPolicy} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={onReset} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Upload New File
        </Button>
        <Button variant="outline" onClick={handleExportJson} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export JSON
        </Button>
      </div>

      <Tabs defaultValue="summary">
        <TabsList className="mb-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <AnalysisSummary data={data} onSelectPolicy={setSelectedPolicyId} />
        </TabsContent>

        <TabsContent value="policies">
          <PoliciesTable policies={data.value} onSelectPolicy={setSelectedPolicyId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
