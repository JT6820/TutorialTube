"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface YouTubeInputProps {
  onConvert: (url: string) => void;
  isLoading: boolean;
}

const YouTubeInput: React.FC<YouTubeInputProps> = ({ onConvert, isLoading }) => {
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const handleSubmit = () => {
    if (!youtubeUrl) {
      toast.error("Please enter a YouTube URL.");
      return;
    }
    // Basic URL validation (can be enhanced)
    if (!youtubeUrl.includes("youtube.com/watch?v=") && !youtubeUrl.includes("youtu.be/")) {
      toast.error("Please enter a valid YouTube URL.");
      return;
    }
    onConvert(youtubeUrl);
  };

  return (
    <div className="flex flex-col sm:flex-row w-full max-w-md items-center space-y-2 sm:space-y-0 sm:space-x-2 p-4">
      <Input
        type="url"
        placeholder="Enter YouTube video URL"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        className="flex-grow"
        disabled={isLoading}
      />
      <Button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Converting..." : "Convert to Tutorial"}
      </Button>
    </div>
  );
};

export default YouTubeInput;
