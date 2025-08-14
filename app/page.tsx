"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Youtube, FileText, Sparkles, Copy, CheckCircle } from "lucide-react"
import { MadeWithDyad } from "@/components/made-with-dyad"

interface TranscriptionResult {
  videoInfo: {
    title: string
    duration: string
    thumbnail: string
  }
  summary: string
  keyTopics: string[]
  transcript: string
}

interface Tutorial {
  title: string
  difficulty: string
  estimatedTime: string
  description: string
  prerequisites: string[]
  materials: string[]
  steps: Array<{
    stepNumber: number
    title: string
    description: string
    tips?: string[]
  }>
  additionalResources: string[]
}

export default function Page() {
  const [url, setUrl] = useState("")
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isGeneratingTutorial, setIsGeneratingTutorial] = useState(false)
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null)
  const [tutorial, setTutorial] = useState<Tutorial | null>(null)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleTranscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setIsTranscribing(true)
    setError("")
    setTranscriptionResult(null)
    setTutorial(null)

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to transcribe video")
      }

      const result = await response.json()
      setTranscriptionResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleGenerateTutorial = async () => {
    if (!transcriptionResult) return

    setIsGeneratingTutorial(true)
    setError("")

    try {
      const response = await fetch("/api/generate-tutorial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: transcriptionResult.transcript,
          videoTitle: transcriptionResult.videoInfo.title,
          summary: transcriptionResult.summary,
          keyTopics: transcriptionResult.keyTopics,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate tutorial")
      }

      const result = await response.json()
      setTutorial(result.tutorial)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGeneratingTutorial(false)
    }
  }

  const copyTutorial = async () => {
    if (!tutorial) return

    const tutorialText = `# ${tutorial.title}

**Difficulty:** ${tutorial.difficulty}
**Estimated Time:** ${tutorial.estimatedTime}

## Description
${tutorial.description}

## Prerequisites
${tutorial.prerequisites.map((p) => `• ${p}`).join("\n")}

## Materials Needed
${tutorial.materials.map((m) => `• ${m}`).join("\n")}

## Steps

${tutorial.steps
  .map(
    (step) => `### Step ${step.stepNumber}: ${step.title}

${step.description}

${step.tips ? step.tips.map((tip) => `💡 **Tip:** ${tip}`).join("\n\n") : ""}
`,
  )
  .join("\n")}

## Additional Resources
${tutorial.additionalResources.map((r) => `• ${r}`).join("\n")}
`

    await navigator.clipboard.writeText(tutorialText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl">
              <Youtube className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
              Tutorial Tube
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform any YouTube video into a comprehensive step-by-step written tutorial using AI
          </p>
        </div>

        {/* YouTube Input Form */}
        <Card className="max-w-2xl mx-auto mb-8 border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Youtube className="h-5 w-5" />
              Enter YouTube URL
            </CardTitle>
            <CardDescription>Paste any YouTube video URL to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTranscribe} className="space-y-4">
              <Input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="border-green-200 focus:border-green-500"
                disabled={isTranscribing}
              />
              <Button
                type="submit"
                disabled={!url.trim() || isTranscribing}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                {isTranscribing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Transcribing Video...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Transcribe Video
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="max-w-2xl mx-auto mb-8 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Transcription Results */}
        {transcriptionResult && (
          <Card className="max-w-4xl mx-auto mb-8 border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                Transcription Complete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Video Info */}
              <div className="flex gap-4">
                <img
                  src={transcriptionResult.videoInfo.thumbnail || "/placeholder.svg"}
                  alt="Video thumbnail"
                  className="w-32 h-24 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{transcriptionResult.videoInfo.title}</h3>
                  <p className="text-gray-600">Duration: {transcriptionResult.videoInfo.duration}</p>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="font-semibold mb-2">Summary</h4>
                <p className="text-gray-700">{transcriptionResult.summary}</p>
              </div>

              {/* Key Topics */}
              <div>
                <h4 className="font-semibold mb-2">Key Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {transcriptionResult.keyTopics.map((topic, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-700">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Generate Tutorial Button */}
              <Button
                onClick={handleGenerateTutorial}
                disabled={isGeneratingTutorial}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                {isGeneratingTutorial ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Tutorial...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Step-by-Step Tutorial
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tutorial Display */}
        {tutorial && (
          <Card className="max-w-4xl mx-auto mb-8 border-green-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Sparkles className="h-5 w-5" />
                  Generated Tutorial
                </CardTitle>
                <Button
                  onClick={copyTutorial}
                  variant="outline"
                  size="sm"
                  className="border-green-200 hover:bg-green-50 bg-transparent"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Tutorial
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tutorial Header */}
              <div>
                <h2 className="text-2xl font-bold mb-4">{tutorial.title}</h2>
                <div className="flex gap-4 mb-4">
                  <Badge className="bg-green-100 text-green-700">{tutorial.difficulty}</Badge>
                  <Badge variant="outline">{tutorial.estimatedTime}</Badge>
                </div>
                <p className="text-gray-700">{tutorial.description}</p>
              </div>

              {/* Prerequisites and Materials */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Prerequisites</h3>
                  <ul className="space-y-1">
                    {tutorial.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span className="text-gray-700">{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Materials Needed</h3>
                  <ul className="space-y-1">
                    {tutorial.materials.map((material, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span className="text-gray-700">{material}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Steps */}
              <div>
                <h3 className="font-semibold mb-4">Steps</h3>
                <div className="space-y-6">
                  {tutorial.steps.map((step) => (
                    <div key={step.stepNumber} className="border-l-4 border-green-200 pl-6">
                      <h4 className="font-semibold text-lg mb-2">
                        Step {step.stepNumber}: {step.title}
                      </h4>
                      <p className="text-gray-700 mb-3">{step.description}</p>
                      {step.tips && step.tips.length > 0 && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="font-medium text-green-800 mb-2">💡 Tips:</p>
                          <ul className="space-y-1">
                            {step.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="text-green-700 text-sm">
                                • {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Resources */}
              {tutorial.additionalResources.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Additional Resources</h3>
                  <ul className="space-y-1">
                    {tutorial.additionalResources.map((resource, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span className="text-gray-700">{resource}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <Card className="border-green-200 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Youtube className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Smart Transcription</h3>
              <p className="text-gray-600 text-sm">
                Advanced AI extracts and cleans up video transcripts for maximum clarity
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">AI Tutorial Generation</h3>
              <p className="text-gray-600 text-sm">
                Transforms transcripts into structured, easy-to-follow step-by-step guides
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Export Ready</h3>
              <p className="text-gray-600 text-sm">
                Copy tutorials in markdown format for blogs, documentation, or personal notes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-green-200">
          <MadeWithDyad />
          <p className="text-gray-600 mt-4">Transform any YouTube video into comprehensive written tutorials with AI</p>
        </footer>
      </div>
    </div>
  )
}
