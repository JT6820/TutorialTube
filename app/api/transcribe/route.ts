import { type NextRequest, NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Extract video ID from YouTube URL
    const videoId = extractVideoId(url)
    if (!videoId) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 })
    }

    // For demo purposes, we'll simulate video info and transcript
    // In a real implementation, you'd use YouTube API and audio transcription
    const mockVideoInfo = {
      title: "How to Build a React App",
      duration: "15:30",
      thumbnail: `/placeholder.svg?height=180&width=320&query=youtube video thumbnail`,
    }

    const mockTranscript = `Welcome to this tutorial on building a React application. Today we'll cover the basics of setting up a new React project, creating components, and managing state. First, let's start by installing Node.js and npm on your system. Once you have those installed, we can use Create React App to bootstrap our project. Run the command 'npx create-react-app my-app' in your terminal. This will create a new directory with all the necessary files and dependencies. Next, we'll explore the project structure and understand what each file does. The src folder contains our main application code, while the public folder has static assets. Let's create our first component by making a new file called Header.js. We'll use functional components with hooks for state management. Remember to import React at the top of each component file. Now let's add some styling using CSS modules to keep our styles organized and scoped to specific components.`

    // Use Groq to analyze and clean up the transcript
    const { text: analysisResult } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt: `Analyze this video transcript and provide:
1. A concise summary (2-3 sentences)
2. Key topics covered (as a comma-separated list)
3. A cleaned up version of the transcript with better formatting

Transcript: "${mockTranscript}"

Format your response as JSON with keys: summary, keyTopics (array), cleanedTranscript`,
    })

    let analysis
    try {
      analysis = JSON.parse(analysisResult)
    } catch {
      // Fallback if JSON parsing fails
      analysis = {
        summary:
          "This tutorial covers building a React application from scratch, including project setup, component creation, and state management.",
        keyTopics: ["React", "Components", "State Management", "Project Setup", "CSS Modules"],
        cleanedTranscript: mockTranscript,
      }
    }

    return NextResponse.json({
      videoInfo: mockVideoInfo,
      summary: analysis.summary,
      keyTopics: analysis.keyTopics,
      transcript: analysis.cleanedTranscript,
    })
  } catch (error) {
    console.error("Transcription error:", error)
    return NextResponse.json({ error: "Failed to transcribe video" }, { status: 500 })
  }
}

function extractVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}
