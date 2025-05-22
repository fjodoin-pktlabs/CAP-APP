"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface ManualJsonEntryProps {
  onJsonSubmit: (jsonData: any) => void
  onCancel: () => void
}

export function ManualJsonEntry({ onJsonSubmit, onCancel }: ManualJsonEntryProps) {
  const [jsonInput, setJsonInput] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    try {
      setError(null)

      if (!jsonInput.trim()) {
        setError("Please enter JSON data")
        return
      }

      // Create a valid JSON structure for the Microsoft Graph data
      let processedJson = jsonInput.trim()

      // If the input doesn't look like complete JSON, try to wrap it
      if (!processedJson.startsWith("{")) {
        // Assume this might be just the value array part
        if (processedJson.startsWith("[") && processedJson.endsWith("]")) {
          processedJson = `{
            "@odata.context": "https://graph.microsoft.com/beta/$metadata#Collection(microsoft.graph.whatIfAnalysisResult)",
            "value": ${processedJson}
          }`
        } else {
          throw new Error("Input doesn't appear to be valid JSON or an array")
        }
      }

      // Parse to validate
      const jsonData = JSON.parse(processedJson)

      // Check if it has the expected structure
      if (!jsonData["@odata.context"] && !jsonData.value) {
        // Try to add the missing structure
        if (Array.isArray(jsonData)) {
          // It's just an array, wrap it
          const wrappedData = {
            "@odata.context":
              "https://graph.microsoft.com/beta/$metadata#Collection(microsoft.graph.whatIfAnalysisResult)",
            value: jsonData,
          }
          onJsonSubmit(wrappedData)
        } else {
          throw new Error("JSON doesn't have the expected Microsoft Graph structure")
        }
      } else {
        // It has the right structure
        onJsonSubmit(jsonData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON format")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manual JSON Entry</CardTitle>
        <CardDescription>Enter your JSON data directly</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Enter valid JSON data for Microsoft Graph What-If Analysis. The JSON should have an "@odata.context"
            property and a "value" array.
          </p>
        </div>

        <Textarea
          placeholder='{"@odata.context": "https://graph.microsoft.com/beta/$metadata#Collection(microsoft.graph.whatIfAnalysisResult)", "value": [...]}'
          className="font-mono h-64"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Submit JSON</Button>
      </CardFooter>
    </Card>
  )
}
