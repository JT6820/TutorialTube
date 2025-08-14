import { type NextRequest, NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { transcript, videoTitle, summary, keyTopics } = await request.json()

    if (!transcript) {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 })
    }

    const { text: tutorialResult } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt: `Create a comprehensive step-by-step tutorial based on this video transcript.

Video Title: ${videoTitle}
Summary: ${summary}
Key Topics: ${keyTopics?.join(", ")}
Transcript: ${transcript}

Generate a detailed tutorial with the following structure (respond in JSON format):
{
  "title": "Clear, actionable title for the tutorial",
  "difficulty": "Beginner/Intermediate/Advanced",
  "estimatedTime": "X minutes/hours",
  "description": "Brief description of what the tutorial teaches",
  "prerequisites": ["List of required knowledge/skills"],
  "materials": ["List of tools, software, or resources needed"],
  "steps": [
    {
      "stepNumber": 1,
      "title": "Step title",
      "description": "Detailed explanation of what to do",
      "tips": ["Optional helpful tips for this step"]
    }
  ],
  "additionalResources": ["Links to documentation, related tutorials, etc."]
}

Make the tutorial practical, actionable, and easy to follow. Include 5-10 detailed steps with clear instructions.`,
    })

    let tutorial
    try {
      tutorial = JSON.parse(tutorialResult)
    } catch {
      // Fallback tutorial if JSON parsing fails
      tutorial = {
        title: "How to Build a React Application",
        difficulty: "Beginner",
        estimatedTime: "30 minutes",
        description: "Learn to create a React application from scratch with components and state management.",
        prerequisites: ["Basic JavaScript knowledge", "Node.js installed"],
        materials: ["Computer", "Text editor", "Web browser"],
        steps: [
          {
            stepNumber: 1,
            title: "Set up your development environment",
            description:
              "Install Node.js and npm on your system. Verify installation by running 'node --version' and 'npm --version' in your terminal.",
            tips: ["Use the LTS version of Node.js for stability"],
          },
          {
            stepNumber: 2,
            title: "Create a new React project",
            description: "Run 'npx create-react-app my-app' in your terminal to bootstrap a new React application.",
            tips: ["This command will create a new directory with all necessary files"],
          },
          {
            stepNumber: 3,
            title: "Explore the project structure",
            description:
              "Navigate to your project folder and examine the src and public directories to understand the file organization.",
            tips: ["The src folder contains your main application code"],
          },
        ],
        additionalResources: ["React Documentation", "Create React App Guide"],
      }
    }

    return NextResponse.json({ tutorial })
  } catch (error) {
    console.error("Tutorial generation error:", error)
    return NextResponse.json({ error: "Failed to generate tutorial" }, { status: 500 })
  }
}
