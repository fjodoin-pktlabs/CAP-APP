"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileWarning } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FileUploaderProps {
  onFileUpload: (data: any) => void
  error: string | null
}

export function FileUploader({ onFileUpload, error }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      processFile(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    // Reset any previous errors
    setFileName(file.name)

    // Check file type
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      onFileUpload({ error: "Please upload a JSON file" })
      return
    }

    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          throw new Error("Failed to read file")
        }

        let jsonString = event.target.result as string

        // Log the first few characters to help debug
        console.log(
          "First 20 characters:",
          Array.from(jsonString.substring(0, 20)).map((c) => c.charCodeAt(0)),
        )

        // Remove BOM if present (common issue with JSON files)
        if (jsonString.charCodeAt(0) === 0xfeff) {
          console.log("Removing BOM character")
          jsonString = jsonString.slice(1)
        }

        // Trim whitespace from the beginning and end
        jsonString = jsonString.trim()

        // Check if the JSON starts with { or [
        if (!["{", "["].includes(jsonString[0])) {
          throw new Error(`Invalid JSON: File doesn't start with '{' or '['. Found '${jsonString[0]}' instead.`)
        }

        let jsonData
        try {
          jsonData = JSON.parse(jsonString)
        } catch (parseError) {
          console.error("JSON parse error:", parseError)

          // Try to provide more helpful error information
          const errorMessage = parseError instanceof Error ? parseError.message : "Unknown parsing error"

          // Show a preview of the problematic JSON
          const preview =
            jsonString.length > 100
              ? jsonString.substring(0, 50) + "..." + jsonString.substring(jsonString.length - 50)
              : jsonString

          console.error("JSON preview:", preview)

          onFileUpload({
            error: `Invalid JSON format: ${errorMessage}. Please check the file contents or try reformatting the JSON.`,
          })
          return
        }

        // Log the structure to help debug
        console.log("JSON structure:", {
          hasOdataContext: Boolean(jsonData["@odata.context"]),
          hasValue: Boolean(jsonData.value),
          valueIsArray: Array.isArray(jsonData.value),
          valueLength: jsonData.value ? jsonData.value.length : 0,
        })

        onFileUpload(jsonData)
      } catch (error) {
        console.error("File processing error:", error)
        onFileUpload({
          error:
            error instanceof Error ? `Error: ${error.message}` : "An unknown error occurred while processing the file",
        })
      }
    }

    reader.onerror = () => {
      console.error("FileReader error:", reader.error)
      onFileUpload({
        error: reader.error ? `Error reading file: ${reader.error.message}` : "Failed to read the file",
      })
    }

    reader.readAsText(file)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Analysis Data</CardTitle>
        <CardDescription>
          Upload your Microsoft Graph What-If Analysis JSON file to visualize the results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center ${
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Drag and drop your JSON file here</h3>
          <p className="text-sm text-muted-foreground mb-4">or click the button below to browse your files</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />
          <Button onClick={handleButtonClick}>Select File</Button>
          {fileName && <p className="mt-4 text-sm text-muted-foreground">Selected file: {fileName}</p>}
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <FileWarning className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-4 text-xs text-muted-foreground">
          <p>Tip: If you're having trouble uploading, check that:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>The file is a valid JSON file</li>
            <li>The JSON structure contains "@odata.context" and a "value" array</li>
            <li>Try opening the browser console (F12) for more detailed error information</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <p>Your data is processed locally in your browser. No data is sent to any server.</p>
      </CardFooter>
    </Card>
  )
}
