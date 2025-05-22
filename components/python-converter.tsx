"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

interface PythonConverterProps {
  onConversionComplete: (jsonData: any) => void
  onCancel: () => void
  pythonData?: string
}

export function PythonConverter({ onConversionComplete, onCancel, pythonData = "" }: PythonConverterProps) {
  const [input, setInput] = useState(pythonData)
  const [error, setError] = useState<string | null>(null)
  const [converted, setConverted] = useState<string | null>(null)
  const [rawOutput, setRawOutput] = useState<string | null>(null)

  const convertPythonToJson = (pythonStr: string): string => {
    // Step 1: Create a more direct conversion by manually building the JSON
    try {
      // First, let's clean up the input a bit
      let cleaned = pythonStr.trim()

      // Handle the specific case of the data provided
      if (cleaned.startsWith("{'@odata.context':")) {
        // This is a direct conversion of the specific format we've seen
        return `{
          "@odata.context": ${JSON.stringify(cleaned.split("'@odata.context': ")[1].split("', 'value':")[0].replace(/'/g, ""))},
          "value": ${cleaned
            .split("'value': ")[1]
            .replace(/None/g, "null")
            .replace(/True/g, "true")
            .replace(/False/g, "false")
            .replace(/'/g, '"')}
        }`
      }

      // For other Python dictionaries, use a more general approach
      // Replace Python None with JSON null
      cleaned = cleaned.replace(/None/g, "null")

      // Replace Python True/False with JSON true/false
      cleaned = cleaned.replace(/True/g, "true").replace(/False/g, "false")

      // Handle single quotes for keys and string values
      // This is a simplified approach and might not handle all edge cases
      let inString = false
      let result = ""
      let i = 0

      while (i < cleaned.length) {
        const char = cleaned[i]
        const nextChar = i + 1 < cleaned.length ? cleaned[i + 1] : ""

        if (char === "'" && (i === 0 || cleaned[i - 1] !== "\\")) {
          // Replace single quotes with double quotes
          result += '"'
          inString = !inString
        } else if (char === '"' && (i === 0 || cleaned[i - 1] !== "\\")) {
          // Keep existing double quotes
          result += char
          inString = !inString
        } else {
          result += char
        }

        i++
      }

      return result
    } catch (error) {
      console.error("Error in conversion:", error)
      throw new Error("Failed to convert Python to JSON. The format might be too complex.")
    }
  }

  const handleConvert = () => {
    try {
      setError(null)

      if (!input.trim()) {
        setError("Please enter Python dictionary data")
        return
      }

      // Try a direct approach for the specific format we've seen
      if (input.includes("'@odata.context'") && input.includes("'value':")) {
        try {
          // Extract the @odata.context value
          const odataContextMatch = input.match(/'@odata\.context':\s*'([^']+)'/)
          const odataContext = odataContextMatch ? odataContextMatch[1] : ""

          // Extract the value array part
          const valueMatch = input.match(/'value':\s*(\[.+\])/)
          let valueStr = valueMatch ? valueMatch[1] : "[]"

          // Replace Python syntax with JSON syntax
          valueStr = valueStr
            .replace(/None/g, "null")
            .replace(/True/g, "true")
            .replace(/False/g, "false")
            .replace(/'/g, '"')

          // Construct the JSON
          const jsonStr = `{
            "@odata.context": "${odataContext}",
            "value": ${valueStr}
          }`

          // Validate by parsing
          try {
            JSON.parse(jsonStr)
            setConverted(jsonStr)
            setRawOutput(null)
            return
          } catch (parseError) {
            console.log("Direct approach failed, trying alternative method")
          }
        } catch (directError) {
          console.error("Direct conversion failed:", directError)
        }
      }

      // If direct approach failed, try the more general conversion
      const jsonString = convertPythonToJson(input)
      setRawOutput(jsonString)

      // Validate by parsing
      try {
        const parsed = JSON.parse(jsonString)
        const formatted = JSON.stringify(parsed, null, 2)
        setConverted(formatted)
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        setError(
          `Conversion resulted in invalid JSON: ${
            parseError instanceof Error ? parseError.message : "Unknown error"
          }. Try using the manual JSON formatter instead.`,
        )
        setRawOutput(jsonString) // Still show the raw output for debugging
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert Python to JSON")
    }
  }

  const handleUseConverted = () => {
    if (converted) {
      try {
        const jsonData = JSON.parse(converted)
        onConversionComplete(jsonData)
      } catch (err) {
        setError(`Failed to use converted JSON: ${err instanceof Error ? err.message : "Unknown error"}`)
      }
    }
  }

  const handleManualEdit = () => {
    // Switch to the JSON formatter with the current raw output
    if (rawOutput) {
      // This would require coordination with the parent component
      onCancel()
      // Ideally we'd pass the raw output to the JSON formatter
      // For now, we'll just copy it to the clipboard
      navigator.clipboard.writeText(rawOutput)
      alert(
        "The converted text (which needs manual fixing) has been copied to your clipboard. Please paste it into the JSON formatter.",
      )
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Python to JSON Converter</CardTitle>
        <CardDescription>Convert Python dictionary format to valid JSON format</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Your data appears to be in Python dictionary format (with single quotes, None, True/False). This tool will
            convert it to valid JSON format.
          </p>
        </div>

        <Textarea
          placeholder="Paste your Python dictionary here..."
          className="font-mono h-64"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex justify-end">
          <Button onClick={handleConvert}>Convert to JSON</Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {rawOutput && !converted && (
          <div className="space-y-2">
            <Alert variant="warning">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Conversion produced invalid JSON. You may need to manually fix it.
                <Button variant="outline" size="sm" className="ml-2" onClick={handleManualEdit}>
                  Copy & Edit Manually
                </Button>
              </AlertDescription>
            </Alert>

            <Textarea className="font-mono h-64" value={rawOutput} readOnly />
          </div>
        )}

        {converted && (
          <div className="space-y-2">
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>Conversion successful!</AlertDescription>
            </Alert>

            <Textarea className="font-mono h-64" value={converted} readOnly />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleUseConverted} disabled={!converted}>
          Use Converted JSON
        </Button>
      </CardFooter>
    </Card>
  )
}
