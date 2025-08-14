"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, CheckCircle, Sparkles } from "lucide-react"

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

interface TutorialDisplayProps {
  tutorial: Tutorial
}

export default function TutorialDisplay({ tutorial }: TutorialDisplayProps) {
  const [copied, setCopied] = useState(false)

  const copyTutorial = async () => {
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
    <Card className="max-w-4xl mx-auto border-green-200 shadow-lg">
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
  )
}
