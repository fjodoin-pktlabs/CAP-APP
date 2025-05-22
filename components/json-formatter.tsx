"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

interface JsonFormatterProps {
  onFormatComplete: (formattedJson: string) => void
  onCancel: () => void
}

export function JsonFormatter({ onFormatComplete, onCancel }: JsonFormatterProps) {
  const [jsonInput, setJsonInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [formatted, setFormatted] = useState<string | null>(null)

  const handleFormat = () => {
    try {
      setError(null)

      // Try to clean up the JSON string
      let cleanedJson = jsonInput.trim()

      // Remove BOM if present
      if (cleanedJson.charCodeAt(0) === 0xfeff) {
        cleanedJson = cleanedJson.slice(1)
      }

      // Try to parse and re-stringify to format properly
      const parsedJson = JSON.parse(cleanedJson)
      const formattedJson = JSON.stringify(parsedJson, null, 2)

      setFormatted(formattedJson)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse JSON")
      setFormatted(null)
    }
  }

  const handleUseFormatted = () => {
    if (formatted) {
      onFormatComplete(formatted)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>JSON Formatter</CardTitle>
        <CardDescription>Paste your JSON here to format it properly before uploading</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste your JSON here..."
          className="font-mono h-64"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />

        <div className="flex justify-end">
          <Button onClick={handleFormat}>Format JSON</Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {formatted && (
          <div className="space-y-2">
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>JSON formatted successfully!</AlertDescription>
            </Alert>

            <Textarea className="font-mono h-64" value={formatted} readOnly />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleUseFormatted} disabled={!formatted}>
          Use Formatted JSON
        </Button>
      </CardFooter>
    </Card>
  )
}
