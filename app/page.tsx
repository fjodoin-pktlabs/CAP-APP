"use client"

import { useState } from "react"
import { FileUploader } from "@/components/file-uploader"
import { Dashboard } from "@/components/dashboard"
import { JsonFormatter } from "@/components/json-formatter"
import { PythonConverter } from "@/components/python-converter"
import { ManualJsonEntry } from "@/components/manual-json-entry"
import type { WhatIfAnalysisResult } from "@/types/graph-types"
import { Button } from "@/components/ui/button"
import { FileJson, FileCode, Edit } from "lucide-react"

export default function Home() {
  const [analysisData, setAnalysisData] = useState<WhatIfAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showFormatter, setShowFormatter] = useState(false)
  const [showPythonConverter, setShowPythonConverter] = useState(false)
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [pythonData, setPythonData] = useState<string | null>(null)

  const handleFileUpload = (jsonData: any) => {
    // Reset previous state
    setError(null)

    try {
      // Check if there's an error property from the file uploader
      if (jsonData.error) {
        throw new Error(jsonData.error)
      }

      // Basic validation to ensure the JSON has the expected structure
      if (!jsonData["@odata.context"]) {
        throw new Error("Invalid JSON format: Missing '@odata.context' property")
      }

      if (!jsonData.value) {
        throw new Error("Invalid JSON format: Missing 'value' property")
      }

      if (!Array.isArray(jsonData.value)) {
        throw new Error("Invalid JSON format: 'value' property is not an array")
      }

      // Log success information
      console.log("Successfully parsed JSON with", jsonData.value.length, "policies")

      setAnalysisData(jsonData)
    } catch (err) {
      console.error("Error handling file upload:", err)

      // Check if this might be Python format
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      if (errorMessage.includes("position 1") || errorMessage.includes("Unexpected token")) {
        // This is likely Python format - suggest the converter
        setError(
          `${errorMessage} - This might be Python dictionary format instead of JSON. Try the "Convert from Python" option or "Enter JSON Manually".`,
        )
      } else {
        setError(errorMessage)
      }

      setAnalysisData(null)
    }
  }

  const handlePasteJson = () => {
    const textarea = document.createElement("textarea")
    textarea.className = "fixed top-0 left-0 w-full h-full z-50 p-4 bg-background"
    textarea.placeholder = "Paste your JSON here..."
    textarea.style.fontFamily = "monospace"

    const handleBlur = () => {
      if (textarea.value) {
        try {
          // Try to parse as JSON first
          try {
            const jsonData = JSON.parse(textarea.value.trim())
            handleFileUpload(jsonData)
          } catch (jsonError) {
            // If JSON parsing fails, it might be Python format
            setPythonData(textarea.value)
            setShowPythonConverter(true)
          }
        } catch (err) {
          setError(`Failed to parse pasted data: ${err instanceof Error ? err.message : "Unknown error"}`)
        }
      }
      document.body.removeChild(textarea)
    }

    textarea.addEventListener("blur", handleBlur)
    document.body.appendChild(textarea)
    textarea.focus()
  }

  const handleFormattedJson = (formattedJson: string) => {
    try {
      const jsonData = JSON.parse(formattedJson)
      handleFileUpload(jsonData)
      setShowFormatter(false)
    } catch (err) {
      setError(`Failed to use formatted JSON: ${err instanceof Error ? err.message : "Unknown error"}`)
    }
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Microsoft Graph What-If Analysis Visualizer</h1>

      {!analysisData && !showFormatter && !showPythonConverter && !showManualEntry && (
        <div className="max-w-2xl mx-auto">
          <FileUploader onFileUpload={handleFileUpload} error={error} />

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button variant="outline" onClick={() => setShowFormatter(true)} className="flex items-center gap-2">
              <FileJson className="h-4 w-4" />
              Format JSON
            </Button>

            <Button variant="outline" onClick={() => setShowPythonConverter(true)} className="flex items-center gap-2">
              <FileCode className="h-4 w-4" />
              Convert from Python
            </Button>

            <Button variant="outline" onClick={() => setShowManualEntry(true)} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Enter JSON Manually
            </Button>

            <Button variant="outline" onClick={handlePasteJson}>
              Paste Data Directly
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                // Sample data for testing
                const sampleData = {
                  "@odata.context":
                    "https://graph.microsoft.com/beta/$metadata#Collection(microsoft.graph.whatIfAnalysisResult)",
                  value: [
                    {
                      id: "sample-id-1",
                      templateId: "sample-template-1",
                      displayName: "Sample Policy 1",
                      createdDateTime: "2025-03-31T21:52:59.7348449Z",
                      modifiedDateTime: null,
                      state: "enabled",
                      policyApplies: true,
                      analysisReasons: "notSet",
                      conditions: {
                        userRiskLevels: [],
                        signInRiskLevels: [],
                        clientAppTypes: ["all"],
                        servicePrincipalRiskLevels: [],
                        applications: {
                          includeApplications: ["All"],
                          excludeApplications: [],
                          includeUserActions: [],
                        },
                        users: {
                          includeUsers: ["All"],
                          excludeUsers: [],
                          includeGroups: [],
                          excludeGroups: [],
                          includeRoles: [],
                          excludeRoles: [],
                        },
                      },
                      grantControls: {
                        operator: "OR",
                        builtInControls: ["mfa"],
                        customAuthenticationFactors: [],
                        termsOfUse: [],
                      },
                    },
                  ],
                }
                setAnalysisData(sampleData)
              }}
            >
              Load Sample Data
            </Button>
          </div>
        </div>
      )}

      {!analysisData && showFormatter && (
        <div className="max-w-3xl mx-auto">
          <JsonFormatter onFormatComplete={handleFormattedJson} onCancel={() => setShowFormatter(false)} />
        </div>
      )}

      {!analysisData && showPythonConverter && (
        <div className="max-w-3xl mx-auto">
          <PythonConverter
            onConversionComplete={handleFileUpload}
            onCancel={() => {
              setShowPythonConverter(false)
              setPythonData(null)
            }}
            pythonData={pythonData || ""}
          />
        </div>
      )}

      {!analysisData && showManualEntry && (
        <div className="max-w-3xl mx-auto">
          <ManualJsonEntry
            onJsonSubmit={handleFileUpload}
            onCancel={() => {
              setShowManualEntry(false)
            }}
          />
        </div>
      )}

      {analysisData && <Dashboard data={analysisData} onReset={() => setAnalysisData(null)} />}
    </main>
  )
}
