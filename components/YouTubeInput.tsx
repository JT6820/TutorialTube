"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Youtube, FileText } from "lucide-react"

interface YouTubeInputProps {
  onTranscribe: (url: string) => Promise<void>
  isLoading: boolean
}

export default function YouTubeInput({ onTranscribe, isLoading }: YouTubeInputProps) {
  const [url, setUrl] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    await onTranscribe(url.trim())
  }

  return (
    <Card className="max-w-2xl mx-auto border-green-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <Youtube className="h-5 w-5" />
          Enter YouTube URL
        </CardTitle>
        <CardDescription>Paste any YouTube video URL to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border-green-200 focus:border-green-500"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!url.trim() || isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            {isLoading ? (
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
  )
}
